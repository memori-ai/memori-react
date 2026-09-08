import { AnimationAction, AnimationClip, Scene } from 'three';
export type AnimationCategory = 'IDLE' | 'LOADING' | 'ACTION';
export interface AnimationInfo {
    name: string;
    category: AnimationCategory;
    duration: number;
    canLoop: boolean;
    defaultLoopCount: number;
}
export interface AnimationPlayOptions {
    fadeInDuration?: number;
    fadeOutDuration?: number;
    timeScale?: number;
    loopCount?: number;
    fallbackToIdle?: boolean;
}
export declare class AvatarAnimator {
    private mixer;
    private actions;
    private animations;
    private currentAnimation;
    private currentSequence;
    private sequenceIndex;
    private isTransitioning;
    private timeScale;
    private fadeInDuration;
    private fadeOutDuration;
    private avatarType;
    private eventListeners;
    private initialized;
    private idleRotationCount;
    private currentIdleAnimation;
    private idleRotationLimit;
    private lastAnimationTime;
    initialize(scene: Scene, preloadedActions: Record<string, AnimationAction>, animations?: AnimationClip[], avatarType?: 'RPM' | 'CUSTOM_GLB'): Promise<void>;
    private registerClipsDirectly;
    private registerAnimation;
    play(animationName: string, options?: AnimationPlayOptions): void;
    execute(command: string): void;
    processChatEmission(chatEmission: string | null | undefined, isLoading: boolean): void;
    private calculateTransitionOptions;
    private executeWithTransition;
    idle(options?: AnimationPlayOptions): void;
    loading(options?: AnimationPlayOptions): void;
    playSequence(sequence: string[], options?: AnimationPlayOptions): void;
    forceIdle(): void;
    update(delta: number): void;
    private setupMixerEvents;
    setTimeScale(timeScale: number): void;
    private getRandomAnimation;
    private getAnimationInfo;
    private getAnimationCategory;
    on(event: 'start' | 'complete' | 'loop' | 'transition' | 'error', callback: (data: any) => void): void;
    off(event: 'start' | 'complete' | 'loop' | 'transition' | 'error', callback: (data: any) => void): void;
    private emit;
    getCurrentAnimationName(): string | null;
    getAvatarType(): 'RPM' | 'CUSTOM_GLB';
    isInitialized(): boolean;
    getAllAnimationNames(): string[];
    getAnimationsByCategory(category: AnimationCategory): AnimationInfo[];
}
