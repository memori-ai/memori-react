import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
} from 'three';
import { AnimationState } from '../FullbodyAvatar/types';

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

    console.log('[AvatarAnimator] Initializing with:', {
      actionsCount: Object.keys(preloadedActions).length,
      animationsCount: animations.length,
      avatarType,
    });

    // Create a new mixer for the scene
    this.mixer = new AnimationMixer(scene);
    console.log('Mixer created:', this.mixer);
    console.log('Scene for mixer:', scene);

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

    console.log(
      `[AvatarAnimator] Registered animations: ${this.animations.size}`
    );
    console.log(
      'First few registered animations:',
      Array.from(this.animations.entries())
        .slice(0, 5)
        .map(([name, info]) => ({
          name,
          category: info.category,
          duration: info.duration,
        }))
    );

    // Setup mixer event listeners
    this.setupMixerEvents();

    // Use direct approach to start animation (bypassing play method initially)
    const idleAnimations = ['Idle1', 'Idle2', 'Idle3', 'Idle4', 'Idle5'];
    let startedSuccessfully = false;

    for (const idleName of idleAnimations) {
      if (this.actions[idleName]) {
        console.log(
          `[AvatarAnimator] Starting with direct idle animation: ${idleName}`
        );
        try {
          const idleAction = this.actions[idleName];
          idleAction.reset();
          idleAction.setEffectiveTimeScale(1);
          idleAction.setEffectiveWeight(1);
          idleAction.setLoop(Infinity, Infinity);
          idleAction.play();

          // Force an update to kick-start the animation
          if (this.mixer) {
            this.mixer.update(0.01);
            console.log(`${idleName} is now playing:`, idleAction.isRunning());
          }

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
    console.log(
      `[AvatarAnimator] Initialization complete with ${this.animations.size} animations`
    );
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
   * Register animations with basic metadata inference
   * This version has been modified to avoid duplications and prioritize model animations
   */
  private registerAnimations(
    actions: Record<string, AnimationAction>,
    clips: AnimationClip[] = []
  ): void {
    console.log('[AvatarAnimator] Registering animations:');
    console.log(
      `- Actions from preloaded sources: ${Object.keys(actions).length}`
    );
    console.log(`- Clips directly from model: ${clips.length}`);

    // First identify all animation names to check for duplicates
    const allAnimationNames = new Set<string>();

    // Add clip names first (higher priority)
    clips.forEach(clip => allAnimationNames.add(clip.name));

    // Add action names second (lower priority)
    Object.keys(actions).forEach(name => allAnimationNames.add(name));

    console.log(`- Total unique animation names: ${allAnimationNames.size}`);

    // Process the clips first (they have priority)
    clips.forEach(clip => {
      if (this.mixer) {
        // Create action from clip
        const action = this.mixer.clipAction(clip);
        // Store and register
        this.actions[clip.name] = action;
        this.registerAnimation(clip.name, action);
      }
    });

    // Then process any remaining actions that don't conflict with clip names
    Object.entries(actions).forEach(([name, action]) => {
      if (!this.actions[name]) {
        this.actions[name] = action;
        this.registerAnimation(name, action);
      }
    });

    console.log(
      `- Final registered animations: ${Object.keys(this.actions).length}`
    );

    // Log all registered animations by category
    const idleAnimations = this.getAnimationsByCategory('IDLE');
    const loadingAnimations = this.getAnimationsByCategory('LOADING');
    const actionAnimations = this.getAnimationsByCategory('ACTION');

    console.log(
      `- IDLE animations (${idleAnimations.length}): ${idleAnimations
        .map(a => a.name)
        .join(', ')}`
    );
    console.log(
      `- LOADING animations (${loadingAnimations.length}): ${loadingAnimations
        .map(a => a.name)
        .join(', ')}`
    );
    console.log(
      `- ACTION animations (${actionAnimations.length}): ${
        actionAnimations.length > 10
          ? actionAnimations
              .slice(0, 10)
              .map(a => a.name)
              .join(', ') + '...'
          : actionAnimations.map(a => a.name).join(', ')
      }`
    );
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

    console.log(
      `[AvatarAnimator] Registered animation: ${name} (${category}, duration: ${duration.toFixed(
        2
      )}s)`
    );
  }

  /**
   * Set up event listeners for the animation mixer
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

    // Listen for animation completion
    this.mixer.addEventListener('finished', event => {
      const action = event.action as AnimationAction;
      if (!action || !this.currentAnimation) return;

      if (action === this.actions[this.currentAnimation]) {
        console.log(
          '[AvatarAnimator] Animation complete:',
          this.currentAnimation
        );
        this.emit('complete', { animation: this.currentAnimation });

        // Handle sequence progression
        if (
          this.currentSequence &&
          this.sequenceIndex < this.currentSequence.length - 1
        ) {
          console.log('[AvatarAnimator] Progressing sequence:', {
            current: this.sequenceIndex,
            next: this.sequenceIndex + 1,
            sequence: this.currentSequence,
          });

          // Proceed to next animation in sequence with fast transition
          this.sequenceIndex++;
          this.play(this.currentSequence[this.sequenceIndex], {
            fadeInDuration: 0.2,
            fadeOutDuration: 0.2,
            loopCount: 1,
          });
        } else if (
          this.currentSequence &&
          this.sequenceIndex >= this.currentSequence.length - 1
        ) {
          // End of sequence reached - clear sequence and return to idle
          console.log(
            '[AvatarAnimator] End of sequence reached, returning to idle'
          );
          this.currentSequence = null;
          this.sequenceIndex = 0;
          
          // FIXED: Force the transition to idle by directly calling idle()
          // instead of idleWithRotation() which may not properly transition
          this.idle();
        } else if (
          this.getAnimationInfo(this.currentAnimation)?.category !== 'IDLE'
        ) {
          // Single non-idle animation completed
          console.log('[AvatarAnimator] Returning to idle after completion');
          // FIXED: Force the transition to idle
          this.idle();
        }
      }
    });
  }

  /**
   * Play a specific animation with improved error handling and debugging
   */
  play(animationName: string, options: AnimationPlayOptions = {}): void {
    try {
      console.log(`[AvatarAnimator] Attempting to play: ${animationName}`);

      if (!this.initialized || !this.mixer) {
        console.warn(
          `[AvatarAnimator] Cannot play ${animationName} - not initialized`
        );
        return;
      }

      console.log(
        `Mixer status: initialized=${!!this.mixer}, actionCount=${
          Object.keys(this.actions).length
        }`
      );

      // Check if animation exists
      const nextAction = this.actions[animationName];
      console.log(
        `Next action for ${animationName}:`,
        nextAction ? 'Found' : 'Not found'
      );

      if (!nextAction) {
        console.warn(`[AvatarAnimator] Animation not found: ${animationName}`);
        console.warn(
          '[AvatarAnimator] Available animations:',
          Object.keys(this.actions).join(', ')
        );

        // Try a different animation as fallback
        if (options.fallbackToIdle !== false) {
          const fallbackAnim = Object.keys(this.actions)[0];
          console.log(
            `[AvatarAnimator] Trying fallback animation: ${fallbackAnim}`
          );
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

      // Log the animation details
      console.log('Action details:', {
        name: animationName,
        duration: nextAction.getClip().duration,
        weight: nextAction.getEffectiveWeight(),
        enabled: nextAction.enabled,
        isRunning: nextAction.isRunning(),
        timeScale: nextAction.timeScale,
      });

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
      } else {
        // FIXED: Only update currentIdleAnimation for idle animations
        // For non-idle animations, we keep track of the current animation
        // but don't modify currentIdleAnimation
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
          console.log('[AvatarAnimator] Fading out:', this.currentAnimation);
          currentAction.fadeOut(fadeOut);
        }
      }

      // Configure next animation
      nextAction.reset();
      nextAction.fadeIn(fadeIn);
      nextAction.timeScale = timeScale;

      // Ensure action is enabled
      nextAction.enabled = true;
      nextAction.setEffectiveWeight(1.0);

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

      nextAction.play();

      // Update state
      this.currentAnimation = animationName;
      this.isTransitioning = true;

      // Force an update to kick-start the animation
      if (this.mixer) {
        this.mixer.update(0.01);
        console.log(
          `[AvatarAnimator] Forced mixer update after starting ${animationName}`
        );
        console.log(`${animationName} is now playing:`, nextAction.isRunning());
      }

      // Reset transition state after fade-in time
      setTimeout(() => {
        this.isTransitioning = false;
      }, fadeIn * 1000);

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
   * Play a sequence of animations with proper transitions
   */
  playSequence(sequence: string[], options: AnimationPlayOptions = {}): void {
    if (!sequence || sequence.length === 0) {
      console.warn('[AvatarAnimator] Empty animation sequence provided');
      return;
    }

    // Limit sequence length to 5 as per requirements
    if (sequence.length > 5) {
      console.warn(
        `[AvatarAnimator] Sequence too long (${sequence.length}), limiting to 5 animations`
      );
      sequence = sequence.slice(0, 5);
    }

    console.log('[AvatarAnimator] Playing sequence:', sequence);

    // Validate all animations exist before starting sequence
    const missingAnimations = sequence.filter(name => !this.actions[name]);
    if (missingAnimations.length > 0) {
      console.warn(
        `[AvatarAnimator] Sequence contains missing animations: ${missingAnimations.join(
          ', '
        )}`
      );
      console.warn(
        '[AvatarAnimator] Available animations:',
        Object.keys(this.actions).join(', ')
      );

      // Filter out missing animations
      sequence = sequence.filter(name => this.actions[name]);

      if (sequence.length === 0) {
        console.error(
          '[AvatarAnimator] No valid animations in sequence, defaulting to idle'
        );
        this.idle();
        return;
      }
    }

    // Store sequence info
    this.currentSequence = [...sequence];
    this.sequenceIndex = 0;

    // Use shorter transitions for sequence animations
    const sequenceOptions = {
      ...options,
      fadeInDuration: 0.2, // Faster transitions between sequence items
      fadeOutDuration: 0.2,
      loopCount: 1, // Force single play for sequence animations
    };

    // Play first animation
    const firstAnimation = sequence[0];
    this.play(firstAnimation, sequenceOptions);
  }

  /**
   * Execute an animation command (single animation or sequence)
   */
  execute(command: string): void {
    if (!this.initialized) {
      console.warn('[AvatarAnimator] Cannot execute - not initialized');
      return;
    }

    console.log('[AvatarAnimator] Executing command:', command);

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
   * Process chat emission for animation
   * Enhanced to support multiple formats and be more flexible
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

    // Handle loading state
    if (isLoading) {
      if (this.getAnimationCategory() === 'LOADING') {
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
      this.idle();
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

    // Process matches in order of priority
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

      console.log('[AvatarAnimator] Playing sequence from chat:', sequence);
      this.execute(sequence);
      return;
    }

    if (animationMatch && animationMatch[1]) {
      const animation = animationMatch[1].trim();
      let loopCount: number | undefined;

      // Check for loop count
      if (animationMatch[3]) {
        loopCount = parseInt(animationMatch[3], 10);
      }

      console.log(
        '[AvatarAnimator] Playing animation from chat:',
        animation,
        loopCount ? `loop=${loopCount}` : ''
      );
      this.play(animation, { loopCount });
      return;
    }

    if (emotionMatch && emotionMatch[1]) {
      const emotion = emotionMatch[1].trim();
      // More generalized approach - try to find any animation that starts with this emotion
      const matchingAnimations = this.getAllAnimationNames().filter(name =>
        name.toLowerCase().startsWith(emotion.toLowerCase())
      );

      if (matchingAnimations.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * matchingAnimations.length
        );
        const animationToPlay = matchingAnimations[randomIndex];

        console.log(
          '[AvatarAnimator] Playing emotion-based animation from chat:',
          animationToPlay
        );
        this.play(animationToPlay);
        return;
      }
    }

    // Default to idle if current state is not already idle
    if (this.getAnimationCategory() !== 'IDLE') {
      console.log('[AvatarAnimator] Defaulting to idle');
      this.idle();
    }
  }

  /**
   * Transition to a random idle animation
   * FIXED: Improved to always trigger a new animation
   */
  idle(): void {
    // FIXED: Added debug logging
    console.log('[AvatarAnimator] Idle called with current state:', {
      currentAnimation: this.currentAnimation,
      currentIdleAnimation: this.currentIdleAnimation, 
      idleRotationCount: this.idleRotationCount
    });
    
    // Get all idle animations
    const idleAnimations = this.getAnimationsByCategory('IDLE');
    console.log(`[AvatarAnimator] Available idle animations: ${idleAnimations.length}`);
    
    if (idleAnimations.length > 0) {
      // Choose a random idle animation different from current one
      let randomIdle = this.getRandomAnimation('IDLE', [this.currentAnimation]);
      
      // Force a change if stuck
      if (!randomIdle || randomIdle === this.currentAnimation) {
        // Get the first available idle that's not the current one
        const alternativeIdles = idleAnimations
          .filter(info => info.name !== this.currentAnimation)
          .map(info => info.name);
          
        if (alternativeIdles.length > 0) {
          randomIdle = alternativeIdles[0];
        } else if (idleAnimations.length > 0) {
          // If all else fails, use the first available idle
          randomIdle = idleAnimations[0].name;
        }
      }
      
      if (randomIdle) {
        console.log('[AvatarAnimator] Transitioning to idle:', randomIdle);
        // Get current animation state for smoother transition
        const currentAction = this.actions[this.currentAnimation || ''];
        const currentTime = currentAction?.time || 0;
        
        // Calculate dynamic fade durations based on current state and animation type
        let fadeOutDuration = 0.4; // Default faster fade out
        let fadeInDuration = 0.6; // Default slower fade in for smoothness
        
        // Adjust fade durations based on current animation state
        if (currentAction?.isRunning()) {
          // If current animation is active, use longer crossfade
          fadeOutDuration = 0.8;
          fadeInDuration = 1.0;
        }
        
        // Further adjust based on animation categories
        const currentCategory = this.getAnimationCategory();
        if (currentCategory === 'ACTION') {
          // Faster transitions from action animations
          fadeOutDuration = 0.3;
          fadeInDuration = 0.5;
        } else if (currentCategory === 'IDLE') {
          // Smoother transitions between idle animations
          fadeOutDuration = 1.0;
          fadeInDuration = 1.2;
        }
        
        // Play new animation with optimized transition parameters
        this.play(randomIdle, {
          loopCount: 0,
          fadeInDuration,
          fadeOutDuration,
          timeScale: 0.85 // Slightly slower for more natural idle motion
        });
        
        this.currentIdleAnimation = randomIdle;
        this.idleRotationCount = 0;
        return;
      }
    } else {
      // Fallback for avatars without idle animations
      console.warn(
        '[AvatarAnimator] No idle animations available, checking fallback options'
      );

      if (this.avatarType === 'RPM') {
        // For RPM avatars, we should have fallback animations
        console.warn(
          '[AvatarAnimator] RPM avatar without idle animations - this is unexpected'
        );
      } else {
        // For custom GLB, use any loopable animation
        const loopableAnimations = Array.from(this.animations.values())
          .filter(info => info.canLoop)
          .map(info => info.name);

        if (loopableAnimations.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * loopableAnimations.length
          );
          const fallbackAnimation = loopableAnimations[randomIndex];
          console.log(
            '[AvatarAnimator] Using fallback loopable animation as idle:',
            fallbackAnimation
          );
          this.play(fallbackAnimation, { 
            loopCount: 0, 
            fadeInDuration: 0.8,
            fadeOutDuration: 0.6,
            timeScale: 0.85
          });
          this.currentIdleAnimation = fallbackAnimation;
          this.idleRotationCount = 0;
        } else if (Object.keys(this.actions).length > 0) {
          // Last resort: use the first available animation
          const firstAnimation = Object.keys(this.actions)[0];
          console.log(
            '[AvatarAnimator] Using first available animation as idle fallback:',
            firstAnimation
          );
          this.play(firstAnimation, { 
            loopCount: 0,
            fadeInDuration: 0.8,
            fadeOutDuration: 0.6,
            timeScale: 0.85
          });
          this.currentIdleAnimation = firstAnimation;
          this.idleRotationCount = 0;
        }
      }
    }
  }


  /**
   * Specialized idle mode that rotates between different idle animations
   * after a certain number of loops
   * FIXED: More aggressive about forcing the transition
   */
  idleWithRotation(): void {
    console.log('[AvatarAnimator] idleWithRotation called with state:', {
      currentAnimation: this.currentAnimation,
      currentIdleAnimation: this.currentIdleAnimation,
      category: this.getAnimationCategory()
    });
    
    // FIXED: First check if we're even in an idle animation
    const currentCategory = this.getAnimationCategory();
    const isCurrentlyIdle = currentCategory === 'IDLE';
    
    // If not in an idle animation, force transition to idle
    if (!isCurrentlyIdle) {
      console.log('[AvatarAnimator] Not currently in an idle animation, forcing idle transition');
      this.idle();
      return;
    }
    
    // If we already have an idle animation playing
    if (
      this.currentIdleAnimation &&
      this.getAnimationInfo(this.currentIdleAnimation)?.category === 'IDLE'
    ) {
      // Check if we need to rotate to a new idle animation
      if (this.idleRotationCount >= this.idleRotationLimit) {
        // Time to change to a new idle animation
        const previousIdle = this.currentIdleAnimation;
        const newIdle = this.getRandomAnimation('IDLE', [previousIdle]);

        if (newIdle && newIdle !== previousIdle) {
          console.log(
            `[AvatarAnimator] Rotating idle after ${this.idleRotationCount} loops: ${previousIdle} -> ${newIdle}`
          );
          this.play(newIdle, { 
            loopCount: 0,
            fadeInDuration: 0.2,
            fadeOutDuration: 0.2
          });
          this.currentIdleAnimation = newIdle;
          this.idleRotationCount = 0;
        } else {
          // If we couldn't find a different idle, just reset the counter
          this.idleRotationCount = 0;
        }
      } else {
        // Just increment the counter and continue with current idle
        this.idleRotationCount++;
        console.log(
          `[AvatarAnimator] Idle animation ${this.currentIdleAnimation} loop ${this.idleRotationCount}/${this.idleRotationLimit}`
        );
      }
    } else {
      // FIXED: Even if currentCategory is IDLE but currentIdleAnimation is wrong,
      // force a transition to a proper idle animation
      console.log('[AvatarAnimator] State inconsistency detected, forcing proper idle');
      this.idle();
    }
  }

  /**
   * Transition to a random loading animation
   * FIXED: Added faster transitions for loading animations
   */
  loading(): void {
    const randomLoading = this.getRandomAnimation('LOADING');
    if (randomLoading) {
      console.log('[AvatarAnimator] Transitioning to loading:', randomLoading);
      this.play(randomLoading, { 
        loopCount: 0,
        fadeInDuration: 1.0,
        fadeOutDuration: 1.0
      }); // infinite loop with faster transitions
    } else {
      console.warn(
        '[AvatarAnimator] No loading animations available, using idle instead'
      );
      this.idle();
    }
  }
  
  /**
   * FIXED: Added a method to force transition to idle, useful for debugging
   */
  forceIdle(): void {
    console.log('[AvatarAnimator] Force transitioning to idle');

    
    const idleAnimations = this.getAnimationsByCategory('IDLE');
    if (idleAnimations.length > 0) {
      // Just pick the first idle animation
      const forcedIdle = idleAnimations[0].name;
      
      // Force play with immediate transition
      this.play(forcedIdle, {
        loopCount: 0,
        fadeInDuration: 0.8,
        fadeOutDuration: 0.8
      });
      
      // Update state
      this.currentIdleAnimation = forcedIdle;
      this.idleRotationCount = 0;
      
      console.log(`[AvatarAnimator] Forced idle transition to: ${forcedIdle}`);
    } else {
      console.error('[AvatarAnimator] No idle animations available for forced transition');
    }
  }

  /**
   * Update animation system
   */
  update(delta: number): void {
    if (!this.initialized || !this.mixer) return;
    this.mixer.update(delta);
  }

  /**
   * Set the animation time scale
   */
  setTimeScale(timeScale: number): void {
    console.log('[AvatarAnimator] Setting time scale:', timeScale);
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