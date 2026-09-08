interface BlinkConfig {
    minInterval: number;
    maxInterval: number;
    blinkDuration: number;
}
interface UseAvatarBlinkProps {
    enabled: boolean;
    setMorphTargetInfluences: (morphTargetInfluences: any) => void;
    config?: Partial<BlinkConfig>;
}
export declare function useAvatarBlink({ enabled, setMorphTargetInfluences, config }: UseAvatarBlinkProps): {
    isBlinking: boolean;
    lastBlinkTime: number;
    triggerBlink: () => void;
};
export {};
