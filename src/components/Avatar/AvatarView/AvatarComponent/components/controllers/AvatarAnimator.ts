import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Scene } from 'three';

// Animation categories
type AnimationCategory = 'IDLE' | 'LOADING' | 'ACTION';

// Animation metadata with essential properties
interface AnimationInfo {
  name: string;
  category: AnimationCategory;
  duration: number;
  canLoop: boolean;
  defaultLoopCount: number; // 0 for infinite
}

// Animation play options
interface AnimationPlayOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  timeScale?: number;
  loopCount?: number;
  fallbackToIdle?: boolean;
}

/**
 * Simplified AvatarAnimator class
 * A streamlined animation management system for 3D avatars
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
  private fadeInDuration: number = 0.5;
  private fadeOutDuration: number = 0.5;
  private avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB';
  
  // Event system
  private eventListeners: Record<string, Array<(data: any) => void>> = {
    start: [],
    complete: [],
    loop: [],
    transition: [],
    error: []
  };
  
  // Initialization state
  private initialized: boolean = false;
  
  /**
   * Initialize the animator with pre-loaded animations
   */
  async initialize(
    scene: Scene,
    preloadedActions: Record<string, AnimationAction>,
    animations: AnimationClip[] = [],
    avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB'
  ): Promise<void> {
    // Create a new mixer for the scene
    this.mixer = new AnimationMixer(scene);
    
    // Store actions and avatar type
    this.actions = { ...preloadedActions };
    this.avatarType = avatarType;
    
    // Register animations with basic metadata
    this.registerAnimations(preloadedActions, animations);
    
    // Set up mixer event listeners
    this.setupMixerEvents();
    
    // Start with a random idle animation
    const randomIdle = this.getRandomAnimation('IDLE');
    if (randomIdle) {
      this.play(randomIdle);
    } else {
      console.warn('No idle animations available for initialization');
    }
    
    this.initialized = true;
    console.log(`AvatarAnimator initialized with ${this.animations.size} animations`);
  }
  
  /**
   * Register animations with basic metadata inference
   */
  private registerAnimations(
    actions: Record<string, AnimationAction>,
    clips: AnimationClip[] = []
  ): void {
    // Register actions we already have
    Object.entries(actions).forEach(([name, action]) => {
      this.registerAnimation(name, action);
    });
    
    // Add any additional clips
    clips.forEach(clip => {
      if (!actions[clip.name] && this.mixer) {
        const action = this.mixer.clipAction(clip);
        this.actions[clip.name] = action;
        this.registerAnimation(clip.name, action);
      }
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
    
    if (name.toLowerCase().includes('idle')) {
      category = 'IDLE';
      defaultLoopCount = 0; // infinite
      canLoop = true;
    } else if (name.toLowerCase().includes('loading')) {
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
      defaultLoopCount
    });
  }
  
  /**
   * Set up event listeners for the animation mixer
   */
  private setupMixerEvents(): void {
    if (!this.mixer) return;
    
    // Listen for animation loops
    this.mixer.addEventListener('loop', (event) => {
      const action = event.action as AnimationAction;
      if (!action || !this.currentAnimation) return;
      
      if (action === this.actions[this.currentAnimation]) {
        this.emit('loop', { animation: this.currentAnimation });
      }
    });
    
    // Listen for animation completion
    this.mixer.addEventListener('finished', (event) => {
      const action = event.action as AnimationAction;
      if (!action || !this.currentAnimation) return;
      
      if (action === this.actions[this.currentAnimation]) {
        this.emit('complete', { animation: this.currentAnimation });
        
        // Handle sequence progression
        if (this.currentSequence && this.sequenceIndex < this.currentSequence.length - 1) {
          this.sequenceIndex++;
          this.play(this.currentSequence[this.sequenceIndex]);
        } else if (this.getAnimationInfo(this.currentAnimation)?.category !== 'IDLE') {
          // Return to idle after non-idle animations complete
          this.idle();
        }
      }
    });
  }
  
  /**
   * Play a specific animation
   */
  play(animationName: string, options: AnimationPlayOptions = {}): void {
    if (!this.initialized || !this.mixer) {
      console.warn('AvatarAnimator not initialized');
      return;
    }
    
    // Check if animation exists
    const nextAction = this.actions[animationName];
    if (!nextAction) {
      console.warn(`Animation not found: ${animationName}`);
      if (options.fallbackToIdle !== false) {
        this.idle();
      }
      return;
    }
    
    // Get animation info
    const animInfo = this.getAnimationInfo(animationName);
    if (!animInfo) {
      console.warn(`Animation info not found: ${animationName}`);
      if (options.fallbackToIdle !== false) {
        this.idle();
      }
      return;
    }
    
    // Set up transition parameters
    const fadeIn = options.fadeInDuration ?? this.fadeInDuration;
    const fadeOut = options.fadeOutDuration ?? this.fadeOutDuration;
    const loopCount = options.loopCount ?? animInfo.defaultLoopCount;
    const timeScale = options.timeScale ?? this.timeScale;
    
    // Emit transition event
    this.emit('transition', {
      from: this.currentAnimation,
      to: animationName
    });
    
    // Fade out current animation if exists
    if (this.currentAnimation) {
      const currentAction = this.actions[this.currentAnimation];
      if (currentAction) {
        currentAction.fadeOut(fadeOut);
      }
    }
    
    // Configure next animation
    nextAction.reset();
    nextAction.fadeIn(fadeIn);
    nextAction.timeScale = timeScale;
    
    // Set loop behavior
    if (loopCount === 0) {
      // Infinite looping
      nextAction.setLoop(Infinity, Infinity);
    } else {
      // Limited loops or single play
      nextAction.setLoop(loopCount > 1 ? loopCount : LoopOnce, loopCount > 1 ? loopCount : 1);
      nextAction.clampWhenFinished = true;
    }
    
    nextAction.play();
    
    // Update state
    this.currentAnimation = animationName;
    this.isTransitioning = true;
    
    // Reset transition state after fade-in time
    setTimeout(() => {
      this.isTransitioning = false;
    }, fadeIn * 1000);
    
    // Emit start event
    this.emit('start', {
      animation: animationName,
      category: animInfo.category,
      loopCount
    });
  }
  
  /**
   * Play a sequence of animations
   */
  playSequence(sequence: string[], options: AnimationPlayOptions = {}): void {
    if (!sequence || sequence.length === 0) {
      console.warn('Empty animation sequence provided');
      return;
    }
    
    // Store sequence info
    this.currentSequence = [...sequence];
    this.sequenceIndex = 0;
    
    // Play first animation
    const firstAnimation = sequence[0];
    this.play(firstAnimation, {
      ...options,
      loopCount: 1 // Force single play for sequence animations
    });
  }
  
  /**
   * Execute an animation command
   */
  execute(command: string): void {
    if (!this.initialized) {
      console.warn('AvatarAnimator not initialized');
      return;
    }
    
    try {
      // Simple sequence parsing with -> operator
      if (command.includes('->')) {
        const sequence = command.split('->').map(s => s.trim());
        this.playSequence(sequence);
      } else {
        // Single animation play
        this.play(command);
      }
    } catch (error) {
      console.error('Error executing animation command:', error);
      this.emit('error', { error, command });
      this.idle();
    }
  }
  
  /**
   * Process chat emission for animation
   */
  processChatEmission(chatEmission: string | null | undefined, isLoading: boolean): void {
    if (!this.initialized) {
      console.warn('AvatarAnimator not initialized');
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
    
    // Parse animation sequence
    const sequenceMatch = chatEmission.match(
      /<output class="animation-sequence">(.*?)<\/output>/
    );
    if (sequenceMatch && sequenceMatch[1]) {
      const sequence = sequenceMatch[1].trim();
      
      // Check if already playing this sequence
      if (
        this.currentSequence &&
        this.currentSequence.join('->') === sequence &&
        this.sequenceIndex < this.currentSequence.length
      ) {
        // Already playing this sequence
        return;
      }
      
      console.log('[AvatarAnimator] Playing sequence:', sequence);
      this.execute(sequence);
      return;
    }
    
    // Parse emotion
    const emotionMatch = chatEmission.match(
      /<output class="memori-emotion">(.*?)<\/output>/
    );
    if (emotionMatch && emotionMatch[1]) {
      const emotion = emotionMatch[1].trim();
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      const animationName = `${emotion}${randomNumber}`;
      
      // Check if already playing an animation with this emotion
      if (
        this.currentAnimation &&
        this.currentAnimation.startsWith(emotion)
      ) {
        // Already playing this emotion
        return;
      }
      
      console.log('[AvatarAnimator] Playing emotion:', emotion);
      this.play(animationName);
      return;
    }
    
    // Default to idle if current state is not already idle
    if (this.getAnimationCategory() !== 'IDLE') {
      this.idle();
    }
  }
  
  /**
   * Transition to a random idle animation
   */
  idle(): void {
    const randomIdle = this.getRandomAnimation('IDLE', [this.currentAnimation]);
    if (randomIdle) {
      this.play(randomIdle, { loopCount: 0 }); // infinite loop
    } else {
      console.warn('No idle animations available');
    }
  }
  
  /**
   * Transition to a random loading animation
   */
  loading(): void {
    const randomLoading = this.getRandomAnimation('LOADING');
    if (randomLoading) {
      this.play(randomLoading, { loopCount: 0 }); // infinite loop
    } else {
      console.warn('No loading animations available, using idle instead');
      this.idle();
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
  private getRandomAnimation(category: AnimationCategory, exclude: (string | null)[] = []): string | null {
    const filteredAnimations = Array.from(this.animations.values())
      .filter(info => 
        info.category === category && 
        !exclude.includes(info.name)
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
  on(event: 'start' | 'complete' | 'loop' | 'transition' | 'error', callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }
  
  off(event: 'start' | 'complete' | 'loop' | 'transition' | 'error', callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
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
    return Array.from(this.animations.values())
      .filter(info => info.category === category);
  }
} 