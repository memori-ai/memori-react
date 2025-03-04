import { 
  AnimationClip, 
  AnimationAction, 
  AnimationMixer, 
  Object3D, 
  Scene,
  SkinnedMesh
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMetadata } from './AnimationRegistry';

/**
 * Animation source configuration
 */
export interface AnimationSource {
  primary: string; // URL or reference to avatar's built-in animations
  fallbacks: Record<string, string>; // Keyed by avatar type (RPM, CUSTOM_GLB)
}

/**
 * AnimationLoader class
 * Responsible for loading animation data from various sources
 */
export class AnimationLoader {
  private avatarAnimations: Record<string, AnimationAction> = {};
  private fallbackAnimations: Record<string, Record<string, AnimationAction>> = {
    'RPM': {},
    'CUSTOM_GLB': {}
  };
  private mixer: AnimationMixer;
  private scene: Scene | null = null;
  private avatarType: 'RPM' | 'CUSTOM_GLB' = 'CUSTOM_GLB';
  private animationSources: Record<string, AnimationSource> = {};
  private loadPromises: Partial<Record<string, Promise<Record<string, AnimationAction>>>> = {};
  
  /**
   * Constructor for AnimationLoader
   * @param mixer Animation mixer
   */
  constructor(mixer: AnimationMixer) {
    this.mixer = mixer;
  }
  
  /**
   * Set the animation sources
   * @param sources Animation sources configuration
   */
  setAnimationSources(sources: Record<string, AnimationSource>): void {
    this.animationSources = sources;
  }
  
  /**
   * Set the avatar type
   * @param type Avatar type (RPM or CUSTOM_GLB)
   */
  setAvatarType(type: 'RPM' | 'CUSTOM_GLB'): void {
    this.avatarType = type;
  }
  
  /**
   * Load animations from the avatar model
   * @param scene Three.js scene containing the avatar
   * @returns Promise resolving to loaded animation actions
   */
  async loadFromAvatar(scene: Scene): Promise<Record<string, AnimationAction>> {
    this.scene = scene;
    
    // Extract avatar type from the scene
    this.detectAvatarType(scene);
    
    // Find animation clips in the scene
    const clips: AnimationClip[] = [];
    scene.traverse((object: Object3D) => {
      if ('animations' in object && Array.isArray(object.animations)) {
        clips.push(...object.animations);
      }
    });
    
    // Create actions from clips
    const actions: Record<string, AnimationAction> = {};
    clips.forEach(clip => {
      const action = this.mixer.clipAction(clip);
      actions[clip.name] = action;
    });
    
    this.avatarAnimations = actions;
    
    console.log(`Loaded ${Object.keys(actions).length} animations from avatar`);
    return actions;
  }
  
  /**
   * Detect avatar type from scene
   * @param scene Three.js scene
   */
  private detectAvatarType(scene: Scene): void {
    let isRPM = false;
    
    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh && 
        (object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')
      ) {
        isRPM = true;
      }
    });
    
    this.avatarType = isRPM ? 'RPM' : 'CUSTOM_GLB';
    console.log(`Detected avatar type: ${this.avatarType}`);
  }
  
  /**
   * Load animations from an external URL
   * @param url URL to load animations from
   * @param avatarType Target avatar type for the animations
   * @returns Promise resolving to loaded animation actions
   */
  async loadFromUrl(url: string, avatarType: 'RPM' | 'CUSTOM_GLB'): Promise<Record<string, AnimationAction>> {
    // Check if already loading this URL
    if (this.loadPromises[url]) {
      return this.loadPromises[url]!;  // Add non-null assertion since we just checked
    }
    
    const loadPromise = new Promise<Record<string, AnimationAction>>((resolve, reject) => {
      const loader = new GLTFLoader();
      
      loader.load(
        url,
        (gltf) => {
          const clips = gltf.animations || [];
          const actions: Record<string, AnimationAction> = {};
          
          clips.forEach(clip => {
            const action = this.mixer.clipAction(clip);
            actions[clip.name] = action;
          });
          
          this.fallbackAnimations[avatarType] = {
            ...this.fallbackAnimations[avatarType],
            ...actions
          };
          
          console.log(`Loaded ${clips.length} fallback animations for ${avatarType} from ${url}`);
          resolve(actions);
        },
        (progress) => {
          // Progress callback
          console.log(`Loading animations: ${Math.round(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          console.error(`Error loading animations from ${url}:`, error);
          reject(error);
        }
      );
    });
    
    this.loadPromises[url] = loadPromise;
    return loadPromise;
  }
  
  /**
   * Get an animation, trying avatar first then fallback URLs
   * @param name Animation name
   * @param avatarType Avatar type
   * @returns Animation action or null if not found
   */
  getAnimation(name: string, avatarType: 'RPM' | 'CUSTOM_GLB'): AnimationAction | null {
    // First try to get from avatar animations
    if (this.avatarAnimations[name]) {
      return this.avatarAnimations[name];
    }
    
    // Then try fallback animations for the specified avatar type
    if (this.fallbackAnimations[avatarType][name]) {
      return this.fallbackAnimations[avatarType][name];
    }
    
    // Not found
    return null;
  }


  getAllAnimations(avatarType: 'RPM' | 'CUSTOM_GLB'): Record<string, AnimationAction> {
    return {
      ...this.avatarAnimations,
      ...this.fallbackAnimations[avatarType]
    };
  }
  

  getAvatarType(): 'RPM' | 'CUSTOM_GLB' {
    return this.avatarType;
  }
  /**
   * Check if an animation is available
   * @param name Animation name
   * @param avatarType Avatar type
   * @returns True if animation is available
   */
  hasAnimation(name: string, avatarType: 'RPM' | 'CUSTOM_GLB'): boolean {
    return !!(this.avatarAnimations[name] || this.fallbackAnimations[avatarType][name]);
  }
  
  /**
   * Load fallback animations for a category
   * @param category Animation category
   * @param avatarType Avatar type
   */
  async loadFallbacksForCategory(
    category: string, 
    avatarType: 'RPM' | 'CUSTOM_GLB'
  ): Promise<void> {
    // Get source URL for the category and avatar type
    const source = this.animationSources[category];
    if (!source) {
      console.warn(`No animation source defined for category: ${category}`);
      return;
    }
    
    const fallbackUrl = source.fallbacks[avatarType];
    if (!fallbackUrl) {
      console.warn(`No fallback URL defined for ${avatarType} in category ${category}`);
      return;
    }
    
    // Load from URL
    await this.loadFromUrl(fallbackUrl, avatarType);
  }
  
  /**
   * Get all available animation names
   * @param avatarType Avatar type
   * @returns Array of animation names
   */
  getAllAnimationNames(avatarType: 'RPM' | 'CUSTOM_GLB'): string[] {
    const avatarNames = Object.keys(this.avatarAnimations);
    const fallbackNames = Object.keys(this.fallbackAnimations[avatarType]);
    
    // Combine and remove duplicates
    return [...new Set([...avatarNames, ...fallbackNames])];
  }
  
  /**
   * Get all animations by category
   * @param category Animation category
   * @param metadata Map of animation metadata
   * @param avatarType Avatar type
   * @returns Record of animation name to action
   */
  getAnimationsByCategory(
    category: string,
    metadata: Map<string, AnimationMetadata>,
    avatarType: 'RPM' | 'CUSTOM_GLB'
  ): Record<string, AnimationAction> {
    const result: Record<string, AnimationAction> = {};
    
    // Get all animation names
    const allNames = this.getAllAnimationNames(avatarType);
    
    // Filter by category using metadata
    for (const name of allNames) {
      const animMetadata = metadata.get(name);
      if (animMetadata && animMetadata.category === category) {
        const action = this.getAnimation(name, avatarType);
        if (action) {
          result[name] = action;
        }
      }
    }
    
    return result;
  }
}