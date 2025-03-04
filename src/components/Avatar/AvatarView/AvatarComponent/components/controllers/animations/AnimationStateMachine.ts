import { AnimationAction, AnimationMixer, LoopOnce } from 'three';
import { AnimationMetadata } from './AnimationRegistry';

/**
 * Animation states for the state machine
 */
export enum AnimationState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ACTION = 'ACTION',
  TRANSITIONING = 'TRANSITIONING'
}

/**
 * Animation state information
 */
export interface AnimationStateInfo {
  currentAnimation: string | null;
  previousAnimation: string | null;
  isTransitioning: boolean;
  loopCount: number;
  currentSequence: string[] | null;
  sequenceIndex: number;
  transitionStartTime: number;
  category: 'IDLE' | 'LOADING' | 'ACTION';
}

/**
 * Configuration for animation transitions
 */
export interface AnimationConfig {
  fadeInDuration: number;
  fadeOutDuration: number;
  defaultTimeScale: number;
  transitionThreshold: number; // Percentage of animation completion before transition
  idleSelection: {
    minIdleDuration: number; // Minimum time to stay in one idle animation
    maxConsecutiveLoops: number; // Maximum times to loop one idle before changing
  };
}

/**
 * Default configuration for animations
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  fadeInDuration: 0.5,
  fadeOutDuration: 0.5,
  defaultTimeScale: 1.0,
  transitionThreshold: 0.9, // 90% completion before transition
  idleSelection: {
    minIdleDuration: 2.0, // seconds
    maxConsecutiveLoops: 2,
  },
};

/**
 * Animation playback options
 */
export interface AnimationPlayOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  timeScale?: number;
  loopCount?: number; // 0 for infinite
  fallbackToIdle?: boolean;
}

/**
 * AnimationStateMachine class
 * Manages transitions between animation states
 */
export class AnimationStateMachine {
  private currentState: AnimationStateInfo;
  private mixer: AnimationMixer;
  private actions: Record<string, AnimationAction>;
  private config: AnimationConfig;
  private eventListeners: Record<string, Array<(data: any) => void>>;
  private registry: Map<string, AnimationMetadata>;
  private lastUpdateTime: number = 0;
  private idleLoopTimer: number = 0;
  private avatarType: 'RPM' | 'CUSTOM_GLB';
  
  /**
   * Constructor for AnimationStateMachine
   * @param mixer Three.js animation mixer
   * @param actions Available animation actions
   * @param avatarType Type of avatar (RPM or CUSTOM_GLB)
   * @param registry Map of animation metadata
   * @param config Animation configuration
   */
  constructor(
    mixer: AnimationMixer,
    actions: Record<string, AnimationAction>,
    avatarType: 'RPM' | 'CUSTOM_GLB',
    registry: Map<string, AnimationMetadata>,
    config: AnimationConfig = DEFAULT_ANIMATION_CONFIG
  ) {
    this.mixer = mixer;
    this.actions = actions;
    this.avatarType = avatarType;
    this.registry = registry;
    this.config = { ...DEFAULT_ANIMATION_CONFIG, ...config };
    
    this.currentState = {
      currentAnimation: null,
      previousAnimation: null,
      isTransitioning: false,
      loopCount: 0,
      currentSequence: null,
      sequenceIndex: 0,
      transitionStartTime: 0,
      category: 'IDLE'
    };
    
    this.eventListeners = {
      'start': [],
      'complete': [],
      'loop': [],
      'transition': []
    };
    
    // Initialize mixer event listeners for detecting loops and completions
    this.mixer.addEventListener('loop', this.handleLoop.bind(this));
    this.mixer.addEventListener('finished', this.handleFinished.bind(this));
  }
  
  /**
   * Initialize the state machine with a starting animation
   * @param startAnimationName Starting animation name
   */
  initialize(startAnimationName: string): void {
    const metadata = this.registry.get(startAnimationName);
    if (!metadata) {
      console.warn(`Animation not found: ${startAnimationName}. Using fallback.`);
      this.findAndPlayFallbackAnimation('IDLE');
      return;
    }
    
    this.transitionTo(startAnimationName, {
      loopCount: metadata.defaultLoopCount
    });
  }
  
  /**
   * Handle animation loop event
   * @param event Loop event
   */
  private handleLoop(event: any): void {
    const action = event.action as AnimationAction;
    if (!action || action !== this.actions[this.currentState.currentAnimation || '']) {
      return;
    }
    
    this.currentState.loopCount++;
    
    // Emit loop event
    this.emit('loop', {
      animation: this.currentState.currentAnimation,
      loopCount: this.currentState.loopCount
    });
    
    // Check if we need to switch idle animations based on loop count
    if (
      this.currentState.category === 'IDLE' && 
      this.currentState.loopCount >= this.config.idleSelection.maxConsecutiveLoops
    ) {
      this.selectAndPlayRandomIdle();
    }
  }
  
  /**
   * Handle animation finished event
   * @param event Finished event
   */
  private handleFinished(event: any): void {
    const action = event.action as AnimationAction;
    if (!action || action !== this.actions[this.currentState.currentAnimation || '']) {
      return;
    }
    
    // Emit complete event
    this.emit('complete', {
      animation: this.currentState.currentAnimation
    });
    
    // Handle sequence progression
    if (this.currentState.currentSequence && this.currentState.category === 'ACTION') {
      this.progressSequence();
    } else if (this.currentState.category !== 'IDLE') {
      // For non-idle animations that finish, return to idle
      this.selectAndPlayRandomIdle();
    }
  }
  
  /**
   * Progress to the next animation in the sequence
   */
  private progressSequence(): void {
    if (!this.currentState.currentSequence) return;
    
    this.currentState.sequenceIndex++;
    
    // Check if we've reached the end of the sequence
    if (this.currentState.sequenceIndex >= this.currentState.currentSequence.length) {
      // End of sequence, go back to idle
      this.emit('complete', {
        type: 'sequence',
        sequence: this.currentState.currentSequence
      });
      
      this.currentState.currentSequence = null;
      this.currentState.sequenceIndex = 0;
      this.selectAndPlayRandomIdle();
      return;
    }
    
    // Play the next animation in the sequence
    const nextAnimation = this.currentState.currentSequence[this.currentState.sequenceIndex];
    this.transitionTo(nextAnimation, {
      fallbackToIdle: true
    });
  }
  
  /**
   * Select and play a random idle animation
   */
  private selectAndPlayRandomIdle(): void {
    // Find available idle animations for this avatar type
    const idleAnimations = Array.from(this.registry.values())
      .filter(metadata => 
        metadata.category === 'IDLE' && 
        metadata.compatibleWith.includes(this.avatarType)
      );
    
    if (idleAnimations.length === 0) {
      console.warn('No idle animations available for this avatar type.');
      return;
    }
    
    // Exclude the current animation to avoid playing the same one
    const availableIdles = idleAnimations.filter(
      metadata => metadata.name !== this.currentState.currentAnimation
    );
    
    // If no other idles available, reuse the current one
    if (availableIdles.length === 0) {
      this.restartCurrentAnimation();
      return;
    }
    
    // Select a random idle animation
    const randomIndex = Math.floor(Math.random() * availableIdles.length);
    const selectedIdle = availableIdles[randomIndex];
    
    this.transitionTo(selectedIdle.name, {
      loopCount: selectedIdle.defaultLoopCount
    });
  }
  
  /**
   * Restart the current animation
   */
  private restartCurrentAnimation(): void {
    if (!this.currentState.currentAnimation) return;
    
    const currentAction = this.actions[this.currentState.currentAnimation];
    if (!currentAction) return;
    
    // Reset the animation
    currentAction.reset();
    
    // Reset the loop count
    this.currentState.loopCount = 0;
    
    // Emit start event
    this.emit('start', {
      animation: this.currentState.currentAnimation,
      restarted: true
    });
  }
  
  /**
   * Find and play a fallback animation when the requested one isn't available
   * @param category Animation category to fallback to
   */
  private findAndPlayFallbackAnimation(category: 'IDLE' | 'LOADING' | 'ACTION'): void {
    // Find any animation in the specified category
    const animations = Array.from(this.registry.values())
      .filter(metadata => 
        metadata.category === category && 
        metadata.compatibleWith.includes(this.avatarType)
      );
    
    if (animations.length === 0) {
      console.error(`No ${category} animations available for this avatar type.`);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * animations.length);
    const fallbackAnimation = animations[randomIndex];
    
    console.log(`Using fallback ${category} animation: ${fallbackAnimation.name}`);
    
    this.transitionTo(fallbackAnimation.name, {
      loopCount: fallbackAnimation.defaultLoopCount
    });
  }
  
  /**
   * Transition to a new animation state
   * @param animationName Animation name to transition to
   * @param options Animation playback options
   */
  transitionTo(animationName: string, options: AnimationPlayOptions = {}): void {
    // Get animation from the registry
    const metadata = this.registry.get(animationName);
    if (!metadata) {
      console.warn(`Animation not found: ${animationName}`);
      if (options.fallbackToIdle) {
        this.findAndPlayFallbackAnimation('IDLE');
      }
      return;
    }
    
    // Get action from actions map
    const nextAction = this.actions[animationName];
    if (!nextAction) {
      console.warn(`Animation action not found: ${animationName}`);
      if (options.fallbackToIdle) {
        this.findAndPlayFallbackAnimation('IDLE');
      }
      return;
    }
    
    // Set up transition parameters
    const fadeInDuration = options.fadeInDuration ?? this.config.fadeInDuration;
    const fadeOutDuration = options.fadeOutDuration ?? this.config.fadeOutDuration;
    const timeScale = options.timeScale ?? this.config.defaultTimeScale;
    const loopCount = options.loopCount ?? metadata.defaultLoopCount;
    
    // Start transition
    this.currentState.isTransitioning = true;
    this.currentState.transitionStartTime = this.mixer.time;
    
    // Emit transition event
    this.emit('transition', {
      from: this.currentState.currentAnimation,
      to: animationName
    });
    
    // If there's a current animation, fade it out
    if (this.currentState.currentAnimation) {
      const currentAction = this.actions[this.currentState.currentAnimation];
      if (currentAction) {
        currentAction.fadeOut(fadeOutDuration);
      }
    }
    
    // Reset and configure the next animation
    nextAction.reset();
    nextAction.fadeIn(fadeInDuration);
    nextAction.play();
    nextAction.timeScale = timeScale;
    
    // Set loop behavior based on animation type and options
    if (loopCount === 0) {
      // Infinite looping
      nextAction.setLoop(Infinity, Infinity);
    } else {
      // Limited loops or single play
      nextAction.setLoop(loopCount > 1 ? loopCount : LoopOnce, loopCount > 1 ? loopCount : 1);
      nextAction.clampWhenFinished = true;
    }
    
    // Update state
    this.currentState.previousAnimation = this.currentState.currentAnimation;
    this.currentState.currentAnimation = animationName;
    this.currentState.category = metadata.category;
    this.currentState.loopCount = 0;
    
    // Emit start event
    this.emit('start', {
      animation: animationName,
      category: metadata.category,
      loopCount: loopCount
    });
    
    // Reset transition state after fade-in time
    setTimeout(() => {
      this.currentState.isTransitioning = false;
    }, fadeInDuration * 1000);
  }
  
  /**
   * Play a sequence of animations
   * @param sequence Array of animation names
   * @param options Animation playback options
   */
  playSequence(sequence: string[], options: AnimationPlayOptions = {}): void {
    if (!sequence || sequence.length === 0) {
      console.warn('Empty animation sequence provided');
      return;
    }
    
    // Save the sequence
    this.currentState.currentSequence = [...sequence];
    this.currentState.sequenceIndex = 0;
    
    // Start with the first animation in the sequence
    const firstAnimation = sequence[0];
    this.transitionTo(firstAnimation, {
      ...options,
      loopCount: 1  // Force single play for sequence animations
    });
  }
  
  /**
   * Update the state machine
   * @param delta Time delta in seconds
   */
  update(delta: number): void {
    // Update the mixer
    this.mixer.update(delta);
    
    this.lastUpdateTime += delta;
    
    // Handle idle timing checks
    if (this.currentState.category === 'IDLE' && !this.currentState.isTransitioning) {
      this.idleLoopTimer += delta;
      
      // Check if we've been in this idle long enough to consider changing
      if (this.idleLoopTimer >= this.config.idleSelection.minIdleDuration) {
        // Only change idles if we've looped enough times
        if (this.currentState.loopCount >= this.config.idleSelection.maxConsecutiveLoops) {
          this.selectAndPlayRandomIdle();
          this.idleLoopTimer = 0;
        }
      }
    } else {
      // Reset idle timer for non-idle animations
      this.idleLoopTimer = 0;
    }
    
    // Handle non-looping animations that are near completion
    if (
      this.currentState.currentAnimation && 
      this.currentState.category !== 'IDLE' && 
      !this.currentState.isTransitioning
    ) {
      const currentAction = this.actions[this.currentState.currentAnimation];
      const metadata = this.registry.get(this.currentState.currentAnimation);
      
      if (currentAction && metadata && !metadata.canLoop) {
        const progress = currentAction.time / currentAction.getClip().duration;
        
        // If we're near the end of a non-looping animation and not in a sequence
        if (
          progress >= this.config.transitionThreshold && 
          !this.currentState.currentSequence
        ) {
          this.selectAndPlayRandomIdle();
        }
      }
    }
  }
  
  /**
   * Get the current animation state
   * @returns Current animation state information
   */
  getCurrentState(): AnimationStateInfo {
    return { ...this.currentState };
  }
  
  /**
   * Set the global time scale for all animations
   * @param timeScale New time scale value
   */
  setTimeScale(timeScale: number): void {
    this.config.defaultTimeScale = timeScale;
    
    // Update current animation if exists
    if (this.currentState.currentAnimation) {
      const currentAction = this.actions[this.currentState.currentAnimation];
      if (currentAction) {
        currentAction.timeScale = timeScale;
      }
    }
  }
  
  /**
   * Register an event listener
   * @param event Event name ('start', 'complete', 'loop', 'transition')
   * @param callback Callback function
   */
  on(event: 'start' | 'complete' | 'loop' | 'transition', callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }
  
  /**
   * Remove an event listener
   * @param event Event name
   * @param callback Callback function to remove
   */
  off(event: 'start' | 'complete' | 'loop' | 'transition', callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        listener => listener !== callback
      );
    }
  }
  
  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
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
}