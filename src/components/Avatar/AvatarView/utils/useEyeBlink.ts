import { useCallback, useEffect, useRef } from 'react';

interface BlinkConfig {
  minInterval: number;
  maxInterval: number;
  blinkDuration: number;
}

const DEFAULT_BLINK_CONFIG: BlinkConfig = {
  minInterval: 1000,    // Minimum time between blinks in milliseconds
  maxInterval: 5000,    // Maximum time between blinks in milliseconds
  blinkDuration: 150,   // Duration of a single blink in milliseconds
};

interface UseAvatarBlinkProps {
  enabled: boolean;
  setMorphTargetInfluences: (morphTargetInfluences: any) => void;
  config?: Partial<BlinkConfig>;
}

export function useAvatarBlink({
  enabled,
  setMorphTargetInfluences,
  config = {}
}: UseAvatarBlinkProps) {
  const blinkTimeoutRef = useRef<NodeJS.Timeout>();
  const isBlinkingRef = useRef(false);
  const lastBlinkTime = useRef(0);
  
  const blinkConfig = {
    ...DEFAULT_BLINK_CONFIG,
    ...config
  };
  
  const blink = useCallback(() => {
    if (!enabled || isBlinkingRef.current) return;
    
    isBlinkingRef.current = true;
    // Close eyes
    setMorphTargetInfluences((prev: any) => ({
      ...prev,
      eyesClosed: 1
    }));
    
    // Open eyes after blinkDuration
    setTimeout(() => {
      setMorphTargetInfluences((prev: any) => ({
        ...prev,
        eyesClosed: 0
      }));
      isBlinkingRef.current = false;
      lastBlinkTime.current = Date.now();
      
      // Schedule next blink
      scheduleNextBlink();
    }, blinkConfig.blinkDuration);
  }, [enabled, blinkConfig.blinkDuration, setMorphTargetInfluences]);
  
  const scheduleNextBlink = useCallback(() => {
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }
    
    // Randomize the next blink delay between min and max interval
    const nextBlinkDelay = Math.random() * 
      (blinkConfig.maxInterval - blinkConfig.minInterval) + 
      blinkConfig.minInterval;
    
    blinkTimeoutRef.current = setTimeout(blink, nextBlinkDelay);
  }, [blink, blinkConfig.maxInterval, blinkConfig.minInterval]);

  // Handle enabled state changes
  useEffect(() => {
    if (enabled) {
      scheduleNextBlink();
    } else {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      // Reset eyes to open
      setMorphTargetInfluences((prevInfluences: any) => ({
        ...prevInfluences,
        eyesClosed: 0
      }));
    }
    
    // Cleanup
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [enabled, scheduleNextBlink, setMorphTargetInfluences]);

  return {
    isBlinking: isBlinkingRef.current,
    lastBlinkTime: lastBlinkTime.current,
    triggerBlink: blink
  };
}