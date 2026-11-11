import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
} from 'three';
import { AnimationState } from '../FullbodyAvatar/types';
import { MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH } from '../../constants';

// Animation categories
export type AnimationCategory = 'IDLE' | 'LOADING' | 'ACTION';

// Animation metadata with essential properties
export interface AnimationInfo {
  name: string;
  category: AnimationCategory;
  duration: number;
  canLoop: boolean;
  defaultLoopCount: number; // 0 for infinite
}

// Animation play options
export interface AnimationPlayOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  timeScale?: number;
  loopCount?: number;
  fallbackToIdle?: boolean;
}

/**
 * Enhanced AvatarAnimator class
 * A system for managing 3D avatar animations with improved sequence parsing and generalized emotion handling
 */
export class AvatarAnimator {
  // Animation system
  private mixer: AnimationMixer | null = null;
  private actions: Record<string, AnimationAction> = {};
  private animations: Map<string, AnimationInfo> = new Map();

  // Current state tracking
  private currentAnimation: string | null = null;
  private currentSequence: string[] | null = null;
  private sequenceIndex: number = 0;
  private isTransitioning: boolean = false;

  // Configuration
  private timeScale: number = 1.0;
  private fadeInDuration: number = 0.8;
  private fadeOutDuration: number = 0.8;
  private avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB';

  // Event system
  private eventListeners: Record<string, Array<(data: any) => void>> = {
    start: [],
    complete: [],
    loop: [],
    transition: [],
    error: [],
  };

  // Initialization state
  private initialized: boolean = false;

  // Track idle rotations
  private idleRotationCount = 0;
  private currentIdleAnimation: string | null = null;
  private idleRotationLimit = 5; // Number of loops before changing idle animation
  private lastAnimationTime: number | null = null;
  /**
   * Initialize the animator with pre-loaded animations
   * Added protection against multiple initializations
   */
  async initialize(
    scene: Scene,
    preloadedActions: Record<string, AnimationAction>,
    animations: AnimationClip[] = [],
    avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB'
  ): Promise<void> {
    // Guard against multiple initializations
    if (this.initialized || this.mixer) {
      console.warn(
        '[AvatarAnimator] Already initialized, ignoring duplicate initialization'
      );
      return;
    }

    // Create a new mixer for the scene
    this.mixer = new AnimationMixer(scene);

    // Store avatar type
    this.avatarType = avatarType;

    // Start with empty actions to avoid duplicates
    this.actions = {};

    // First register animations directly from the model
    this.registerClipsDirectly(animations);

    // Then register any additional preloaded actions that don't conflict
    // This ensures avatar animations take precedence over fallback animations
    Object.entries(preloadedActions).forEach(([name, action]) => {
      if (!this.actions[name]) {
        this.actions[name] = action;
        this.registerAnimation(name, action);
      }
    });
    // Setup mixer event listeners
    this.setupMixerEvents();

    // Use direct approach to start animation (bypassing play method initially)
    const idleAnimations = ['Idle1', 'Idle2', 'Idle3', 'Idle4', 'Idle5'];
    let startedSuccessfully = false;

    for (const idleName of idleAnimations) {
      if (this.actions[idleName]) {
        try {
          const idleAction = this.actions[idleName];
          idleAction.reset();
          idleAction.setEffectiveTimeScale(1);
          idleAction.setEffectiveWeight(1);
          idleAction.setLoop(Infinity, Infinity);
          idleAction.play();

          // Update state
          this.currentAnimation = idleName;
          this.currentIdleAnimation = idleName;
          this.idleRotationCount = 0;

          startedSuccessfully = true;
          break;
        } catch (error) {
          console.error(`Error starting ${idleName}:`, error);
        }
      }
    }

    if (!startedSuccessfully) {
      console.warn(
        '[AvatarAnimator] Could not start any idle animation directly'
      );
      // Don't try fallback methods here to avoid loops
    }

    // Mark as initialized AFTER everything is set up
    this.initialized = true;
  }

  /**
   * Register animation clips directly from the model
   * This ensures model animations take priority
   */
  private registerClipsDirectly(clips: AnimationClip[]): void {
    if (!this.mixer) return;

    clips.forEach(clip => {
      // Create a new action for each clip
      const action = this.mixer?.clipAction(clip);
      if (!action) {
        console.warn(
          `[AvatarAnimator] Failed to create action for clip: ${clip.name}`
        );
        return;
      }
      // Store the action with its name
      this.actions[clip.name] = action;
      // Register the animation metadata
      this.registerAnimation(clip.name, action);
    });
  }

  /**
   * Register a single animation with inferred metadata
   */
  private registerAnimation(name: string, action: AnimationAction): void {
    const duration = action.getClip().duration;

    // Infer category and loop settings from name
    let category: AnimationCategory = 'ACTION';
    let defaultLoopCount = 1;
    let canLoop = false;

    // Categorize animations based on name patterns
    const lowerName = name.toLowerCase();
    if (lowerName.includes('idle')) {
      category = 'IDLE';
      defaultLoopCount = 0; // infinite
      canLoop = true;
    } else if (lowerName.includes('loading') || lowerName.includes('wait')) {
      category = 'LOADING';
      defaultLoopCount = 0; // infinite
      canLoop = true;
    }

    // Store animation info
    this.animations.set(name, {
      name,
      category,
      duration,
      canLoop,
      defaultLoopCount,
    });
  }

  /**
   * Play a specific animation with improved transition handling
   */
  play(animationName: string, options: AnimationPlayOptions = {}): void {
    try {
      if (!this.initialized || !this.mixer) {
        console.warn(
          `[AvatarAnimator] Cannot play ${animationName} - not initialized`
        );
        return;
      }

      // Check if animation exists
      const nextAction = this.actions[animationName];

      if (!nextAction) {
        console.warn(`[AvatarAnimator] Animation not found: ${animationName}`);
        if (options.fallbackToIdle !== false) {
          const fallbackAnim = Object.keys(this.actions)[0];
          if (fallbackAnim) {
            this.play(fallbackAnim, { ...options, fallbackToIdle: false });
          }
        }
        return;
      }

      // Get animation info
      const animInfo = this.getAnimationInfo(animationName);
      if (!animInfo) {
        console.warn(
          `[AvatarAnimator] Animation info not found: ${animationName}`
        );
        if (options.fallbackToIdle !== false) {
          this.idle();
        }
        return;
      }

      // Skip if the same animation is already playing and is the same category
      if (
        this.currentAnimation === animationName &&
        !this.isTransitioning &&
        options.loopCount === undefined // Only skip if not explicitly changing loop count
      ) {
        return;
      }

      // Prevent overlapping transitions
      if (this.isTransitioning) {
        // Complete any ongoing transition first
        if (this.currentAnimation) {
          const currentAction = this.actions[this.currentAnimation];
          if (currentAction) {
            currentAction.fadeOut(0.1); // Quick fade out of current transition
          }
        }
      }

      // Set up transition parameters
      const fadeIn = options.fadeInDuration ?? this.fadeInDuration;
      const fadeOut = options.fadeOutDuration ?? this.fadeOutDuration;
      const loopCount = options.loopCount ?? animInfo.defaultLoopCount;
      const timeScale = options.timeScale ?? this.timeScale;

      // Check if this is an idle animation
      const isIdleAnimation = animInfo.category === 'IDLE';
      if (isIdleAnimation) {
        this.currentIdleAnimation = animationName;
        this.idleRotationCount = 0;
      }

      // Emit transition event
      this.emit('transition', {
        from: this.currentAnimation,
        to: animationName,
      });

      // Fade out current animation if exists
      if (this.currentAnimation) {
        const currentAction = this.actions[this.currentAnimation];
        if (currentAction) {
          // Important: We must stop the action if we're resetting it to the same animation
          if (this.currentAnimation === animationName) {
            currentAction.stop();
          } else {
            currentAction.fadeOut(fadeOut);
          }
        }
      }

      // Configure next animation
      nextAction.reset();
      nextAction.fadeIn(fadeIn);
      nextAction.timeScale = timeScale;

      // Ensure action is enabled and weight is reset
      nextAction.enabled = true;
      // nextAction.setEffectiveWeight(0); // Start from zero weight for smooth fade in

      // Set loop behavior
      if (loopCount === 0) {
        // Infinite looping
        nextAction.setLoop(Infinity, Infinity);
      } else {
        // Limited loops or single play
        nextAction.setLoop(
          loopCount > 1 ? loopCount : LoopOnce,
          loopCount > 1 ? loopCount : 1
        );
        nextAction.clampWhenFinished = true;
      }

      // Play the animation
      nextAction.play();

      // Update state
      this.currentAnimation = animationName;
      this.isTransitioning = true;

      // Clear transition state after the longer of the fade durations
      const transitionDuration = Math.max(fadeIn, fadeOut) * 1000;
      setTimeout(() => {
        this.isTransitioning = false;
      }, transitionDuration);

      // Emit start event
      this.emit('start', {
        animation: animationName,
        category: animInfo.category,
        loopCount,
      });
    } catch (error) {
      console.error(
        `[AvatarAnimator] Error in play method for ${animationName}:`,
        error
      );
      // Try to recover
      if (options.fallbackToIdle !== false) {
        try {
          this.idle();
        } catch (recoveryError) {
          console.error(
            '[AvatarAnimator] Failed to recover with idle animation:',
            recoveryError
          );
        }
      }
    }
  }

  /**
   * Execute an animation command (single animation or sequence)
   */
  execute(command: string): void {
    if (!this.initialized) {
      console.warn('[AvatarAnimator] Cannot execute - not initialized');
      return;
    }

    try {
      // Parse for loop count if specified
      let loopCount: number | undefined;
      const loopMatch = command.match(/\[loop=(\d+)\]/);
      if (loopMatch) {
        loopCount = parseInt(loopMatch[1], 10);
        command = command.replace(loopMatch[0], '').trim();
      }

      // Simple sequence parsing with -> operator
      if (command.includes('->')) {
        const sequence = command.split('->').map(s => s.trim());
        this.playSequence(sequence, { loopCount });
      } else {
        // Single animation play
        this.play(command, { loopCount });
      }
    } catch (error) {
      console.error(
        '[AvatarAnimator] Error executing animation command:',
        error
      );
      this.emit('error', { error, command });
      this.idle();
    }
  }

  /**
   * Enhanced processChatEmission method with improved transition handling
   */
  processChatEmission(
    chatEmission: string | null | undefined,
    isLoading: boolean
  ): void {
    if (!this.initialized) {
      console.warn(
        '[AvatarAnimator] Cannot process chat emission - not initialized'
      );
      return;
    }

    // Track whether we're transitioning from loading state
    const wasInLoadingState = this.getAnimationCategory() === 'LOADING';

    // Handle loading state
    if (isLoading) {
      if (wasInLoadingState) {
        // Already in loading state
        return;
      }
      this.loading();
      return;
    }

    // Default to idle if no chat emission
    if (!chatEmission) {
      if (this.getAnimationCategory() === 'IDLE') {
        // Already idle
        return;
      }
      // Use longer transition when coming from loading state
      this.idle(
        wasInLoadingState
          ? { fadeInDuration: 1.2, fadeOutDuration: 1.0 }
          : undefined
      );
      return;
    }

    // Look for animation instructions in various formats

    // 1. Look for sequence format with specific tag
    const sequenceMatch = chatEmission.match(
      /<output class="animation-sequence">(.*?)<\/output>/
    );

    // 2. Look for animation tag with optional loop count
    const animationMatch = chatEmission.match(
      /<output class="animation">(.*?)(\[loop=(\d+)\])?<\/output>/
    );

    // 3. Look for legacy emotion format (for backward compatibility)
    const emotionMatch = chatEmission.match(
      /<output class="memori-emotion">(.*?)<\/output>/
    );

    // Calculate transition parameters based on current state
    const transitionOptions = this.calculateTransitionOptions();

    // Process matches in order of priority
    //ex. <output class="animation-sequence">Anger->Sadness->Surprise</output>
    if (sequenceMatch && sequenceMatch[1]) {
      const sequence = sequenceMatch[1].trim();

      // Check if already playing this sequence
      if (
        this.currentSequence &&
        this.currentSequence.join('->') === sequence &&
        this.sequenceIndex < this.currentSequence.length
      ) {
        return;
      }

      // Execute sequence with enhanced transition options
      this.executeWithTransition(sequence, transitionOptions);
      return;
    }

    //ex. <output class="animation">Anger</output> OR <output class="animation">[loop=2]Anger</output>
    if (animationMatch && animationMatch[1]) {
      const animation = animationMatch[1].trim();
      let loopCount: number | undefined;

      // Check for loop count
      if (animationMatch[3]) {
        loopCount = parseInt(animationMatch[3], 10);
      }

      // Play with enhanced transition options
      this.play(animation, {
        ...transitionOptions,
        loopCount,
      });
      return;
    }

    //ex. <output class="memori-emotion">Anger</output>
    if (emotionMatch && emotionMatch[1]) {
      const emotion = emotionMatch[1].trim();

      let matchingAnimations: string[] = [];
      //If the name of the emotion is in english, we can use the emotion mapping to find the corresponding animation
      if (
        MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH.find(
          item => item.english === emotion
        )
      ) {
        let matchingEmotions = MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH.filter(
          item => item.english === emotion
        );
        matchingAnimations = this.getAllAnimationNames().filter(name =>
          matchingEmotions.some(emotion =>
            name.toLowerCase().startsWith(emotion.italian.toLowerCase())
          )
        );
      } else {
        // More generalized approach - try to find any animation that starts with this emotion
        matchingAnimations = this.getAllAnimationNames().filter(name =>
          name.toLowerCase().startsWith(emotion.toLowerCase())
        );
      }

      if (matchingAnimations.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * matchingAnimations.length
        );
        const animationToPlay = matchingAnimations[randomIndex];

        // Play with enhanced transition options
        this.play(animationToPlay, transitionOptions);
        return;
      }
    }

    // Default to idle if current state is not already idle
    if (this.getAnimationCategory() !== 'IDLE') {
      this.idle(transitionOptions);
    }
  }

  /**
   * Calculate optimal transition parameters based on current state
   */
  private calculateTransitionOptions(): AnimationPlayOptions {
    // Start with base transition parameters
    const options: AnimationPlayOptions = {
      fadeInDuration: this.fadeInDuration,
      fadeOutDuration: this.fadeOutDuration,
      timeScale: this.timeScale,
    };

    // Get current animation state
    const currentCategory = this.getAnimationCategory();
    const currentAction = this.currentAnimation
      ? this.actions[this.currentAnimation]
      : null;

    options.fadeOutDuration = 0.8;
    options.fadeInDuration = 0.8;

    // Further adjust based on current animation progress
    if (currentAction) {
      const clip = currentAction.getClip();
      const progress = currentAction.time / clip.duration;

      // If we're near the end of the animation (>75%), slightly faster fade out
      if (progress > 0.75) {
        options.fadeOutDuration = Math.max(
          0.4,
          (options.fadeOutDuration ?? 0.8) * 0.8
        );
      }
      // If we're near the beginning (<25%), slightly faster fade in for new animation
      else if (progress < 0.25) {
        options.fadeInDuration = Math.max(
          0.4,
          (options.fadeInDuration ?? 0.8) * 0.8
        );
      }
    }

    return options;
  }

  /**
   * Execute an animation command with enhanced transition handling
   */
  private executeWithTransition(
    command: string,
    options: AnimationPlayOptions = {}
  ): void {
    if (!this.initialized) {
      console.warn('[AvatarAnimator] Cannot execute - not initialized');
      return;
    }

    try {
      // Parse for loop count if specified
      let loopCount: number | undefined;
      const loopMatch = command.match(/\[loop=(\d+)\]/);
      if (loopMatch) {
        loopCount = parseInt(loopMatch[1], 10);
        command = command.replace(loopMatch[0], '').trim();
      }

      // Simple sequence parsing with -> operator
      if (command.includes('->')) {
        const sequence = command.split('->').map(s => s.trim());

        // Enhanced sequence options
        const sequenceOptions = {
          ...options,
          loopCount: loopCount || 1,
        };

        this.playSequence(sequence, sequenceOptions);
      } else {
        // Single animation play with enhanced options
        this.play(command, {
          ...options,
          loopCount,
        });
      }
    } catch (error) {
      console.error(
        '[AvatarAnimator] Error executing animation command:',
        error
      );
      this.emit('error', { error, command });
      this.idle();
    }
  }

  /**
   * Improved idle transition with better animation selection and transitions
   */
  idle(options: AnimationPlayOptions = {}): void {
    // Get all idle animations
    const idleAnimations = this.getAnimationsByCategory('IDLE');

    if (idleAnimations.length > 0) {
      // If already in an idle animation, ensure we pick a different one
      let availableIdles = idleAnimations;

      if (this.getAnimationCategory() === 'IDLE') {
        // Filter out current idle to ensure variety
        availableIdles = idleAnimations.filter(
          info => info.name !== this.currentAnimation
        );

        // If we've filtered out all options, reset to full list
        if (availableIdles.length === 0) {
          availableIdles = idleAnimations;
        }
      }

      // Choose a random idle from available options
      const randomIndex = Math.floor(Math.random() * availableIdles.length);
      const selectedIdle = availableIdles[randomIndex].name;

      // Apply smooth transition options
      const transitionOptions: AnimationPlayOptions = {
        fadeInDuration: options.fadeInDuration ?? 0.7, // Slower fade for natural idle transition
        fadeOutDuration: options.fadeOutDuration ?? 0.7, // Slower fade for natural idle transition
        timeScale: options.timeScale ?? 0.9, // Slightly slower for more natural movement
        loopCount: 0, // Always infinite for idle
        ...options,
      };

      // Always ensure loopCount is 0 (infinite) for idle animations
      transitionOptions.loopCount = 0;

      // Play new idle with optimized transition parameters
      this.play(selectedIdle, transitionOptions);

      // Update idle tracking state
      this.currentIdleAnimation = selectedIdle;
      this.idleRotationCount = 0;

      return;
    } else {
      // Fallback for avatars without idle animations
      console.warn(
        '[AvatarAnimator] No idle animations available, checking fallback options'
      );

      // For custom GLB, use any loopable animation
      const loopableAnimations = Array.from(this.animations.values())
        .filter(info => info.canLoop)
        .map(info => info.name);

      if (loopableAnimations.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * loopableAnimations.length
        );
        const fallbackAnimation = loopableAnimations[randomIndex];

        // Use smooth transition parameters
        this.play(fallbackAnimation, {
          loopCount: 0,
          fadeInDuration: options.fadeInDuration ?? 0.7,
          fadeOutDuration: options.fadeOutDuration ?? 0.7,
          timeScale: options.timeScale ?? 0.9,
        });

        this.currentIdleAnimation = fallbackAnimation;
        this.idleRotationCount = 0;
      } else if (Object.keys(this.actions).length > 0) {
        // Last resort: use any available animation
        const firstAnimation = Object.keys(this.actions)[0];

        this.play(firstAnimation, {
          loopCount: 0,
          fadeInDuration: options.fadeInDuration ?? 0.7,
          fadeOutDuration: options.fadeOutDuration ?? 0.7,
          timeScale: options.timeScale ?? 0.9,
        });

        this.currentIdleAnimation = firstAnimation;
        this.idleRotationCount = 0;
      }
    }
  }

  /**
   * Improved loading animation with transition parameters
   */
  loading(options: AnimationPlayOptions = {}): void {
    const randomLoading = this.getRandomAnimation('LOADING');
    if (randomLoading) {
      // Default transition parameters
      const transitionOptions: AnimationPlayOptions = {
        loopCount: 0, // Always infinite for loading
        fadeInDuration: options.fadeInDuration ?? 0.8,
        fadeOutDuration: options.fadeOutDuration ?? 0.8,
        timeScale: options.timeScale ?? this.timeScale,
        ...options,
      };

      // Always ensure loopCount is 0 (infinite) for loading animations
      transitionOptions.loopCount = 0;

      this.play(randomLoading, transitionOptions);
    } else {
      console.warn(
        '[AvatarAnimator] No loading animations available, using idle instead'
      );
      this.idle(options);
    }
  }

  /**
   * Play a sequence of animations with improved transition handling
   */
  playSequence(sequence: string[], options: AnimationPlayOptions = {}): void {
    if (!sequence || sequence.length === 0) {
      console.warn('[AvatarAnimator] Empty animation sequence provided');
      return;
    }

    // Limit sequence length to prevent performance issues
    if (sequence.length > 5) {
      console.warn(
        `[AvatarAnimator] Sequence too long (${sequence.length}), limiting to 5 animations`
      );
      sequence = sequence.slice(0, 5);
    }

    // Validate all animations exist
    const validSequence = sequence.filter(name => this.actions[name]);

    if (validSequence.length === 0) {
      console.error(
        '[AvatarAnimator] No valid animations in sequence, defaulting to idle'
      );
      this.idle();
      return;
    }

    // Complete any ongoing transition first
    if (this.isTransitioning) {
      // If we're already transitioning, let's make sure it completes
      // before starting the sequence
      setTimeout(() => {
        this.playSequence(sequence, options);
      }, 100);
      return;
    }

    // Store sequence info
    this.currentSequence = [...validSequence];
    this.sequenceIndex = 0;

    // Use optimized transition parameters for first animation in sequence
    const firstAnimationOptions = {
      fadeInDuration: 0.6, // Smoother entry into sequence
      fadeOutDuration: 0.6, // Smoother exit from current animation
      loopCount: 1,
      timeScale: options.timeScale ?? this.timeScale,
    };

    // Play first animation
    const firstAnimation = validSequence[0];
    this.play(firstAnimation, firstAnimationOptions);
  }

  /**
   * FIXED: Added a method to force transition to idle, useful for debugging
   */
  forceIdle(): void {
    // console.log('[AvatarAnimator] Force transitioning to idle');

    const idleAnimations = this.getAnimationsByCategory('IDLE');
    if (idleAnimations.length > 0) {
      // Just pick the first idle animation
      const forcedIdle = idleAnimations[0].name;

      // Force play with immediate transition
      this.play(forcedIdle, {
        loopCount: 0,
        fadeInDuration: 0.8,
        fadeOutDuration: 0.8,
      });

      // Update state
      this.currentIdleAnimation = forcedIdle;
      this.idleRotationCount = 0;

      // console.log(`[AvatarAnimator] Forced idle transition to: ${forcedIdle}`);
    } else {
      console.error(
        '[AvatarAnimator] No idle animations available for forced transition'
      );
    }
  }

  /**
   * Updates animation system with better transition handling
   */
  update(delta: number): void {
    if (!this.initialized || !this.mixer) return;

    // Clamp delta to prevent extreme time jumps which cause jerky transitions
    const clampedDelta = Math.min(delta, 0.1);

    // Update the mixer with clamped delta
    this.mixer.update(clampedDelta);

    // Skip other processing during active transitions
    if (this.isTransitioning) {
      return;
    }

    // Handle sequence progression
    if (this.currentSequence && this.currentAnimation) {
      const currentAction = this.actions[this.currentAnimation];
      if (currentAction) {
        const clipDuration = currentAction.getClip().duration;
        const progress = currentAction.time / clipDuration;

        // If near end of animation and not already transitioning to next
        if (progress > 0.85 && !this.isTransitioning) {
          if (this.sequenceIndex < this.currentSequence.length - 1) {
            // Move to next animation in sequence with smooth transition
            this.sequenceIndex++;
            const nextAnimation = this.currentSequence[this.sequenceIndex];
            this.play(nextAnimation, {
              fadeInDuration: 0.5, // Longer fade for smoother transitions
              fadeOutDuration: 0.5, // Longer fade for smoother transitions
              loopCount: 1,
            });
          } else {
            // End of sequence - return to idle with smooth transition
            this.currentSequence = null;
            this.sequenceIndex = 0;
            this.idle({
              fadeInDuration: 0.7,
              fadeOutDuration: 0.7,
            });
          }
        }
      }
    }

    // Handle idle rotation
    if (
      this.currentAnimation &&
      this.currentIdleAnimation &&
      this.getAnimationCategory() === 'IDLE'
    ) {
      const currentAction = this.actions[this.currentAnimation];
      if (currentAction) {
        const clipDuration = currentAction.getClip().duration;
        const currentTime = currentAction.time % clipDuration;
        const previousTime = this.lastAnimationTime || 0;

        // Detect loop completion (time wraps around)
        if (previousTime > currentTime + 0.1) {
          this.idleRotationCount++;

          // Change idle animation after certain number of loops
          if (this.idleRotationCount >= this.idleRotationLimit) {
            this.idleRotationCount = 0;
            this.idle({
              fadeInDuration: 0.6, // Smooth transition between idles
              fadeOutDuration: 0.6, // Smooth transition between idles
            });
          }
        }

        // Store time for next comparison
        this.lastAnimationTime = currentTime;
      }
    }
  }

  /**
   * Set up event listeners for the animation mixer with improved transition handling
   */
  private setupMixerEvents(): void {
    if (!this.mixer) {
      console.warn(
        '[AvatarAnimator] Cannot setup mixer events - mixer not initialized'
      );
      return;
    }

    // Listen for animation loops
    this.mixer.addEventListener('loop', event => {
      const action = event.action as AnimationAction;
      if (!action || !this.currentAnimation) return;

      if (action === this.actions[this.currentAnimation]) {
        this.emit('loop', { animation: this.currentAnimation });
      }
    });

    // Listen for animation completion with improved transition handling
    this.mixer.addEventListener('finished', event => {
      const action = event.action as AnimationAction;
      if (!action || !this.currentAnimation) return;

      if (action === this.actions[this.currentAnimation]) {
        // Prevent multiple completion handlers during transition
        if (this.isTransitioning) {
          return;
        }

        this.emit('complete', { animation: this.currentAnimation });

        // Add a small delay to ensure clean transition
        setTimeout(() => {
          // Handle sequence progression
          if (
            this.currentSequence &&
            this.sequenceIndex < this.currentSequence.length - 1
          ) {
            // Proceed to next animation in sequence with smooth transition
            this.sequenceIndex++;
            this.play(this.currentSequence[this.sequenceIndex], {
              fadeInDuration: 0.5, // Increased for smoother transitions
              fadeOutDuration: 0.5, // Increased for smoother transitions
              loopCount: 1,
            });
          } else if (
            this.currentSequence &&
            this.sequenceIndex >= this.currentSequence.length - 1
          ) {
            // End of sequence - return to idle with smooth transition
            this.currentSequence = null;
            this.sequenceIndex = 0;
            this.idle({
              fadeInDuration: 0.7,
              fadeOutDuration: 0.7,
            });
          } else if (
            this.currentAnimation &&
            this.getAnimationInfo(this.currentAnimation)?.category !== 'IDLE'
          ) {
            // Non-idle animation completed - return to idle with smooth transition
            this.idle({
              fadeInDuration: 0.7,
              fadeOutDuration: 0.7,
            });
          }
        }, 50); // Small delay to ensure smooth timing
      }
    });
  }
  /**
   * Set the animation time scale
   */
  setTimeScale(timeScale: number): void {
    // console.log('[AvatarAnimator] Setting time scale:', timeScale);
    this.timeScale = timeScale;

    // Update current animation if exists
    if (this.currentAnimation) {
      const currentAction = this.actions[this.currentAnimation];
      if (currentAction) {
        currentAction.timeScale = timeScale;
      }
    }
  }

  /**
   * Get a random animation by category
   */
  private getRandomAnimation(
    category: AnimationCategory,
    exclude: (string | null)[] = []
  ): string | null {
    const filteredAnimations = Array.from(this.animations.values()).filter(
      info => info.category === category && !exclude.includes(info.name)
    );

    if (filteredAnimations.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredAnimations.length);
    return filteredAnimations[randomIndex].name;
  }

  /**
   * Get animation info by name
   */
  private getAnimationInfo(name: string): AnimationInfo | null {
    return this.animations.get(name) || null;
  }

  /**
   * Get the current animation category
   */
  private getAnimationCategory(): AnimationCategory | null {
    if (!this.currentAnimation) return null;
    return this.getAnimationInfo(this.currentAnimation)?.category || null;
  }

  /**
   * Event system methods
   */
  on(
    event: 'start' | 'complete' | 'loop' | 'transition' | 'error',
    callback: (data: any) => void
  ): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  off(
    event: 'start' | 'complete' | 'loop' | 'transition' | 'error',
    callback: (data: any) => void
  ): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        cb => cb !== callback
      );
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error);
        }
      });
    }
  }

  /**
   * Utility getters
   */
  getCurrentAnimationName(): string | null {
    return this.currentAnimation;
  }

  getAvatarType(): 'RPM' | 'CUSTOM_GLB' {
    return this.avatarType;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getAllAnimationNames(): string[] {
    return Array.from(this.animations.keys());
  }

  getAnimationsByCategory(category: AnimationCategory): AnimationInfo[] {
    return Array.from(this.animations.values()).filter(
      info => info.category === category
    );
  }
}
