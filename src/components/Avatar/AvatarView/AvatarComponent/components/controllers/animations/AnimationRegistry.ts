/**
 * AnimationMetadata interface
 * Contains information about an animation's properties and capabilities
 */
export interface AnimationMetadata {
    name: string;
    category: 'IDLE' | 'LOADING' | 'ACTION';
    duration: number;
    canLoop: boolean;
    compatibleWith: ('RPM' | 'CUSTOM_GLB')[];
    defaultLoopCount: number; // 0 for infinite
  }
  
  /**
   * AnimationRegistry class
   * Responsible for registering and retrieving animations and their metadata
   */
  export class AnimationRegistry {
    private animations: Map<string, AnimationMetadata>;
    private categorizedAnimations: Record<string, Set<string>>;
    private compatibilityMap: Record<string, Set<string>>;
    
    constructor() {
      this.animations = new Map();
      this.categorizedAnimations = {
        'IDLE': new Set(),
        'LOADING': new Set(),
        'ACTION': new Set()
      };
      this.compatibilityMap = {
        'RPM': new Set(),
        'CUSTOM_GLB': new Set()
      };
    }
    
    /**
     * Register an animation with metadata
     * @param name Animation name
     * @param metadata Animation metadata
     */
    register(name: string, metadata: AnimationMetadata): void {
      // Ensure the name in metadata matches the registration name
      const normalizedMetadata: AnimationMetadata = {
        ...metadata,
        name
      };
      
      // Register the animation in the main map
      this.animations.set(name, normalizedMetadata);
      
      // Register in category map
      if (this.categorizedAnimations[metadata.category]) {
        this.categorizedAnimations[metadata.category].add(name);
      } else {
        // Create category if it doesn't exist
        this.categorizedAnimations[metadata.category] = new Set([name]);
      }
      
      // Register in compatibility map
      metadata.compatibleWith.forEach(avatarType => {
        if (this.compatibilityMap[avatarType]) {
          this.compatibilityMap[avatarType].add(name);
        } else {
          this.compatibilityMap[avatarType] = new Set([name]);
        }
      });
    }
    
    /**
     * Register multiple animations at once
     * @param animations Record of animation name to metadata
     */
    registerBulk(animations: Record<string, AnimationMetadata>): void {
      Object.entries(animations).forEach(([name, metadata]) => {
        this.register(name, metadata);
      });
    }
    
    /**
     * Get metadata for an animation
     * @param name Animation name
     * @returns Animation metadata or null if not found
     */
    getMetadata(name: string): AnimationMetadata | null {
      return this.animations.get(name) || null;
    }
    
    /**
     * Check if an animation exists
     * @param name Animation name
     * @returns True if animation exists, false otherwise
     */
    hasAnimation(name: string): boolean {
      return this.animations.has(name);
    }
    
    /**
     * Get all animations of a certain category
     * @param category Animation category
     * @returns Array of animation metadata for the category
     */
    getByCategory(category: string): AnimationMetadata[] {
      const categorySet = this.categorizedAnimations[category];
      if (!categorySet) return [];
      
      return Array.from(categorySet)
        .map(name => this.animations.get(name))
        .filter(Boolean) as AnimationMetadata[];
    }
    
    /**
     * Get compatible animations for an avatar type
     * @param avatarType Avatar type (RPM or CUSTOM_GLB)
     * @returns Array of animation metadata compatible with the avatar type
     */
    getCompatible(avatarType: 'RPM' | 'CUSTOM_GLB'): AnimationMetadata[] {
      const compatibleSet = this.compatibilityMap[avatarType];
      if (!compatibleSet) return [];
      
      return Array.from(compatibleSet)
        .map(name => this.animations.get(name))
        .filter(Boolean) as AnimationMetadata[];
    }
    
    /**
     * Get animations that match both category and avatar type
     * @param category Animation category
     * @param avatarType Avatar type
     * @returns Array of matching animation metadata
     */
    getByCategoryAndType(
      category: string, 
      avatarType: 'RPM' | 'CUSTOM_GLB'
    ): AnimationMetadata[] {
      const categoryAnimations = this.getByCategory(category);
      return categoryAnimations.filter(anim => 
        anim.compatibleWith.includes(avatarType)
      );
    }
    
    /**
     * Get a random animation from a category for an avatar type
     * @param category Animation category
     * @param avatarType Avatar type
     * @param exclude Names of animations to exclude
     * @returns Random animation metadata or null if none available
     */
    getRandomFromCategory(
      category: string, 
      avatarType: 'RPM' | 'CUSTOM_GLB',
      exclude: string[] = []
    ): AnimationMetadata | null {
      const matches = this.getByCategoryAndType(category, avatarType)
        .filter(anim => !exclude.includes(anim.name));
      
      if (matches.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * matches.length);
      return matches[randomIndex];
    }

    getAnimationsMap(): Map<string, AnimationMetadata> {
      return this.animations;
    }
    
    /**
     * Clear all registered animations
     */
    clear(): void {
      this.animations.clear();
      Object.keys(this.categorizedAnimations).forEach(key => {
        this.categorizedAnimations[key].clear();
      });
      Object.keys(this.compatibilityMap).forEach(key => {
        this.compatibilityMap[key].clear();
      });
    }
    
    /**
     * Get all registered animation names
     * @returns Array of animation names
     */
    getAllAnimationNames(): string[] {
      return Array.from(this.animations.keys());
    }
    
    /**
     * Get count of registered animations
     * @returns Number of registered animations
     */
    getCount(): number {
      return this.animations.size;
    }
  }
  
  // Example usage:
  /*
  const registry = new AnimationRegistry();
  
  // Register some animations
  registry.register('Idle1', {
    name: 'Idle1',
    category: 'IDLE',
    duration: 3.5,
    canLoop: true,
    compatibleWith: ['RPM', 'CUSTOM_GLB'],
    defaultLoopCount: 0
  });
  
  registry.register('Loading1', {
    name: 'Loading1',
    category: 'LOADING',
    duration: 2.0,
    canLoop: true,
    compatibleWith: ['RPM'],
    defaultLoopCount: 0
  });
  
  // Get animations by category
  const idleAnimations = registry.getByCategory('IDLE');
  console.log(idleAnimations);
  
  // Get compatible animations
  const rpmAnimations = registry.getCompatible('RPM');
  console.log(rpmAnimations);
  
  // Get random idle animation for RPM
  const randomIdle = registry.getRandomFromCategory('IDLE', 'RPM');
  console.log(randomIdle);
  */