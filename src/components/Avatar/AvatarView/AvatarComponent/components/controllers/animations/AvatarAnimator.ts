import { AnimationMixer, Scene, Object3D, SkinnedMesh } from 'three';
import { AnimationRegistry, AnimationMetadata } from './AnimationRegistry';
import { AnimationParser, AnimationCommand } from './AnimationParser';
import { AnimationLoader, AnimationSource } from './AnimationLoader';
import { 
  AnimationStateMachine, 
  AnimationState, 
  AnimationStateInfo,
  AnimationPlayOptions,
  DEFAULT_ANIMATION_CONFIG
} from './AnimationStateMachine';
import { ANIMATION_URLS } from '../../../constants';

// Animation source configuration
const DEFAULT_ANIMATION_SOURCES: Record<string, AnimationSource> = {
  'IDLE': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['FEMALE'],
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  },
  'LOADING': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['FEMALE'],
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  },
  'ACTION': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['FEMALE'],
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  }
};

// Default metadata for standard animations
const DEFAULT_ANIMATION_METADATA: Record<string, Partial<AnimationMetadata>> = {
  // Idle animations
  'Idle1': {
    category: 'IDLE',
    canLoop: true,
    defaultLoopCount: 0, // infinite
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Idle2': {
    category: 'IDLE',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Idle3': {
    category: 'IDLE',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Idle4': {
    category: 'IDLE',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Idle5': {
    category: 'IDLE',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  
  // Loading animations
  'Loading1': {
    category: 'LOADING',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Loading2': {
    category: 'LOADING',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  },
  'Loading3': {
    category: 'LOADING',
    canLoop: true,
    defaultLoopCount: 0,
    compatibleWith: ['RPM', 'CUSTOM_GLB']
  }
};

/**
 * AvatarAnimator class
 * The main facade class that combines all animation system components
 */
export class AvatarAnimator {
  private registry: AnimationRegistry;
  private parser: AnimationParser;
  private loader: AnimationLoader;
  private stateMachine: AnimationStateMachine | null = null;
  private mixer: AnimationMixer | null = null;
  private avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB';
  private initialized: boolean = false;
  private scene: Scene | null = null;
  private animationSources: Record<string, AnimationSource>;
  private eventListeners: Record<string, Array<(data: any) => void>> = {
    'start': [],
    'complete': [],
    'loop': [],
    'transition': [],
    'error': []
  };
  
  /**
   * Constructor for AvatarAnimator
   * @param sources Animation sources configuration
   */
  constructor(sources: Record<string, AnimationSource> = DEFAULT_ANIMATION_SOURCES) {
    this.registry = new AnimationRegistry();
    this.parser = new AnimationParser();
    this.animationSources = { ...DEFAULT_ANIMATION_SOURCES, ...sources };
    
    // Mixer will be created during initialization with the scene
    this.loader = new AnimationLoader(new AnimationMixer(new Object3D()));
    this.loader.setAnimationSources(this.animationSources);
  }
  
  /**
   * Initialize the animator with an avatar model
   * @param scene Three.js scene containing the avatar
   * @param avatarType Avatar type (defaults to auto-detection)
   */
  async initialize(
    scene: Scene, 
    avatarType?: 'RPM' | 'CUSTOM_GLB'
  ): Promise<void> {
    this.scene = scene;
    
    // Create a new mixer for the scene
    this.mixer = new AnimationMixer(scene);
    
    // Create a new loader with the mixer
    this.loader = new AnimationLoader(this.mixer);
    this.loader.setAnimationSources(this.animationSources);
    
    // Load animations from the avatar
    const avatarAnimations = await this.loader.loadFromAvatar(scene);
    
    // Detect or set avatar type
    if (avatarType) {
      this.avatarType = avatarType;
      this.loader.setAvatarType(avatarType);
    } else {
      // Avatar type was auto-detected in loadFromAvatar
      this.avatarType = this.loader.getAvatarType();
    }
    
    // Register found animations with metadata
    this.registerAnimationsWithMetadata(avatarAnimations);
    
    // Load fallbacks for each category
    await Promise.all([
      this.loader.loadFallbacksForCategory('IDLE', this.avatarType),
      this.loader.loadFallbacksForCategory('LOADING', this.avatarType),
      this.loader.loadFallbacksForCategory('ACTION', this.avatarType)
    ]);
    
    // Register fallback animations
    const allAnimations = this.loader.getAllAnimations(this.avatarType);
    this.registerAnimationsWithMetadata(allAnimations);
    
    // Create the state machine
    this.stateMachine = new AnimationStateMachine(
      this.mixer,
      allAnimations,
      this.avatarType,
      this.registry.getAnimationsMap(),
      DEFAULT_ANIMATION_CONFIG
    );
    
    // Forward events from state machine to our listeners
    this.setupEventForwarding();
    
    // Start with a random idle animation
    const randomIdle = this.getRandomIdle();
    if (randomIdle) {
      this.stateMachine.initialize(randomIdle);
    } else {
      console.warn('No idle animations available. Avatar may not animate correctly.');
      
      // Try to initialize with any available animation
      const anyAnimation = this.registry.getAllAnimationNames()[0];
      if (anyAnimation) {
        this.stateMachine.initialize(anyAnimation);
      }
    }
    
    this.initialized = true;
    console.log(`AvatarAnimator initialized with ${this.registry.getCount()} total animations`);
  }
  
  /**
   * Set up event forwarding from state machine to our listeners
   */
  private setupEventForwarding(): void {
    if (!this.stateMachine) return;
    
    const events = ['start', 'complete', 'loop', 'transition'];
    
    events.forEach(event => {
      this.stateMachine?.on(event as any, (data: any) => {
        this.emit(event, data);
      });
    });
  }
  
  /**
   * Register animations with metadata
   * @param animations Record of animation name to action
   */
  private registerAnimationsWithMetadata(
    animations: Record<string, any>
  ): void {
    // Register each animation with appropriate metadata
    Object.keys(animations).forEach(name => {
      const action = animations[name];
      if (!action) return;
      
      // Get clip duration
      const duration = action.getClip().duration;
      
      // Check if we have default metadata for this animation
      let metadata: AnimationMetadata = {
        name,
        duration,
        canLoop: true,
        compatibleWith: [this.avatarType],
        defaultLoopCount: 1,
        category: 'ACTION' // Default category
      };
      
      // Apply default metadata if available
      const defaultMetadata = DEFAULT_ANIMATION_METADATA[name];
      if (defaultMetadata) {
        metadata = { ...metadata, ...defaultMetadata };
      } else {
        // Try to categorize based on name
        if (name.startsWith('Idle')) {
          metadata.category = 'IDLE';
          metadata.defaultLoopCount = 0; // infinite
        } else if (name.startsWith('Loading')) {
          metadata.category = 'LOADING';
          metadata.defaultLoopCount = 0; // infinite
        }
      }
      
      // Register animation with metadata
      this.registry.register(name, metadata);
    });
  }
  
  /**
   * Execute an animation command
   * @param command Animation command string or object
   * @param options Animation playback options
   */
  execute(
    command: string | AnimationCommand,
    options: AnimationPlayOptions = {}
  ): void {
    if (!this.initialized || !this.stateMachine) {
      console.warn('AvatarAnimator not initialized. Call initialize() first.');
      return;
    }
    
    try {
      // Parse the command if it's a string
      let parsedCommand: AnimationCommand;
      if (typeof command === 'string') {
        parsedCommand = this.parser.parse(command, {
          defaultLoopCount: options.loopCount,
          fallbackToIdle: options.fallbackToIdle ?? true
        });
      } else {
        parsedCommand = command;
      }
      
      // Execute based on command type
      switch (parsedCommand.type) {
        case 'SEQUENCE':
          this.playSequence(parsedCommand.animations, {
            ...options,
            loopCount: parsedCommand.loopCount,
            fallbackToIdle: parsedCommand.fallbackToIdle
          });
          break;
          
        case 'RANDOM':
          this.play(parsedCommand.animations[0], {
            ...options,
            loopCount: parsedCommand.loopCount,
            fallbackToIdle: parsedCommand.fallbackToIdle
          });
          break;
          
        case 'SINGLE':
          this.play(parsedCommand.animations[0], {
            ...options,
            loopCount: parsedCommand.loopCount,
            fallbackToIdle: parsedCommand.fallbackToIdle
          });
          break;
      }
    } catch (error) {
      console.error('Error executing animation command:', error);
      this.emit('error', { error, command });
      
      // Fallback to idle in case of error
      this.idle();
    }
  }
  
  /**
   * Play a specific animation
   * @param animationName Animation name
   * @param options Animation playback options
   */
  play(
    animationName: string,
    options: AnimationPlayOptions = {}
  ): void {
    if (!this.initialized || !this.stateMachine) {
      console.warn('AvatarAnimator not initialized. Call initialize() first.');
      return;
    }
    
    this.stateMachine.transitionTo(animationName, options);
  }
  
  /**
   * Play a sequence of animations
   * @param sequence Array of animation names
   * @param options Animation playback options
   */
  playSequence(
    sequence: string[],
    options: AnimationPlayOptions = {}
  ): void {
    if (!this.initialized || !this.stateMachine) {
      console.warn('AvatarAnimator not initialized. Call initialize() first.');
      return;
    }
    
    this.stateMachine.playSequence(sequence, options);
  }
  
  /**
   * Transition to a random idle animation
   */
  idle(): void {
    if (!this.initialized || !this.stateMachine) {
      console.warn('AvatarAnimator not initialized. Call initialize() first.');
      return;
    }
    
    const randomIdle = this.getRandomIdle();
    if (randomIdle) {
      this.stateMachine.transitionTo(randomIdle, {
        loopCount: 0 // infinite
      });
    } else {
      console.warn('No idle animations available.');
    }
  }
  
  /**
   * Transition to a random loading animation
   */
  loading(): void {
    if (!this.initialized || !this.stateMachine) {
      console.warn('AvatarAnimator not initialized. Call initialize() first.');
      return;
    }
    
    const loadingAnims = this.registry.getByCategoryAndType('LOADING', this.avatarType);
    
    if (loadingAnims.length > 0) {
      const randomIndex = Math.floor(Math.random() * loadingAnims.length);
      const loadingAnim = loadingAnims[randomIndex];
      
      this.stateMachine.transitionTo(loadingAnim.name, {
        loopCount: 0 // infinite
      });
    } else {
      console.warn('No loading animations available, using idle instead.');
      this.idle();
    }
  }
  
  /**
   * Get a random idle animation name
   * @returns Random idle animation name or null if none available
   */
  getRandomIdle(): string | null {
    const idleAnim = this.registry.getRandomFromCategory(
      'IDLE', 
      this.avatarType, 
      [this.getCurrentAnimationName() || '']
    );
    
    return idleAnim ? idleAnim.name : null;
  }
  
  /**
   * Get the current animation name
   * @returns Current animation name or null
   */
  getCurrentAnimationName(): string | null {
    if (!this.stateMachine) return null;
    
    const state = this.stateMachine.getCurrentState();
    return state.currentAnimation;
  }
  
  /**
   * Get the current animation state
   * @returns Current animation state information
   */
  getCurrentState(): AnimationStateInfo | null {
    if (!this.stateMachine) return null;
    
    return this.stateMachine.getCurrentState();
  }
  
  /**
   * Set the animation time scale
   * @param timeScale New time scale value
   */
  setTimeScale(timeScale: number): void {
    if (!this.stateMachine) return;
    
    this.stateMachine.setTimeScale(timeScale);
  }
  
  /**
   * Update on each frame
   * @param delta Time delta in seconds
   */
  update(delta: number): void {
    if (!this.initialized || !this.stateMachine) return;
    
    this.stateMachine.update(delta);
  }
  
  /**
   * Register an event listener
   * @param event Event name
   * @param callback Callback function
   */
  on(
    event: 'start' | 'complete' | 'loop' | 'transition' | 'error',
    callback: (data: any) => void
  ): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }
  
  /**
   * Remove an event listener
   * @param event Event name
   * @param callback Callback function to remove
   */
  off(
    event: 'start' | 'complete' | 'loop' | 'transition' | 'error',
    callback: (data: any) => void
  ): void {
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
  
  /**
   * Get the avatar type
   * @returns Avatar type
   */
  getAvatarType(): 'RPM' | 'CUSTOM_GLB' {
    return this.avatarType;
  }
  
  /**
   * Check if the animator is initialized
   * @returns True if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Get the animation registry
   * @returns Animation registry
   */
  getRegistry(): AnimationRegistry {
    return this.registry;
  }
  
  /**
   * Get all available animation names
   * @returns Array of animation names
   */
  getAllAnimationNames(): string[] {
    return this.registry.getAllAnimationNames();
  }
  
  /**
   * Get animations by category
   * @param category Animation category
   * @returns Array of animation metadata
   */
  getAnimationsByCategory(category: string): AnimationMetadata[] {
    return this.registry.getByCategoryAndType(category, this.avatarType);
  }
}