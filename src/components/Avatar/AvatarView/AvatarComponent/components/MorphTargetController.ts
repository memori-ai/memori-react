import { SkinnedMesh } from 'three';
import { MathUtils } from 'three';
import { EMOTION_SMOOTHING, VISEME_SMOOTHING, BLINK_CONFIG } from '../constants';

/**
 * Controller class for handling morph target animations including emotions, visemes and blinking
 */
export class MorphTargetController {
  private headMesh: SkinnedMesh;
  private currentEmotionValues: Record<string, number> = {};
  private previousEmotionKeys: Set<string> = new Set();

  constructor(headMesh: SkinnedMesh) {
    this.headMesh = headMesh;
  }
  /**
   * Updates the morph target influences for emotions, visemes and blinking
   */
  updateMorphTargets(
    currentTime: number,
    emotionMorphTargets: Record<string, number>,
    currentViseme: { name: string; weight: number } | null,
    eyeBlink: boolean,
    blinkState: {
      isBlinking: boolean;
      lastBlinkTime: number;
      nextBlinkTime: number;
      blinkStartTime: number;
    }
  ) {
    // Validate required mesh properties exist
    if (
      !this.headMesh.morphTargetDictionary ||
      !this.headMesh.morphTargetInfluences
    ) {
      console.error('[MorphTargetController] Missing morphTargetDictionary or morphTargetInfluences');
      return;
    }

    // Calculate blink value for this frame
    const blinkValue = this.calculateBlinkValue(
      currentTime,
      blinkState,
      eyeBlink
    );
    
    const currentEmotionKeys = new Set(Object.keys(emotionMorphTargets));

    // Process each morph target
    Object.entries(this.headMesh.morphTargetDictionary).forEach(
      ([key, index]) => {
        if (typeof index !== 'number') return;

        let targetValue = 0;

        // Handle emotion morphs with smoothing
        if (currentEmotionKeys.has(key)) {
          const targetEmotionValue = emotionMorphTargets[key];
          const currentEmotionValue = this.currentEmotionValues[key] || 0;
          const newEmotionValue = MathUtils.lerp(
            currentEmotionValue,
            targetEmotionValue * 3, // Amplify emotion by 3x
            EMOTION_SMOOTHING
          );
          console.log(`[MorphTargetController] Emotion ${key}: current=${currentEmotionValue}, target=${targetEmotionValue}, new=${newEmotionValue}`);
          this.currentEmotionValues[key] = newEmotionValue;
          targetValue += newEmotionValue;
        }

        // Add viseme influence if active
        if (currentViseme && key === currentViseme.name) {
          targetValue += currentViseme.weight;
        }

        // Add blink influence if active
        if (key === 'eyesClosed' && eyeBlink) {
          targetValue += blinkValue;
        }

        // Clamp and smooth final value
        targetValue = MathUtils.clamp(targetValue, 0, 1);
        if (this.headMesh.morphTargetInfluences) {
          const finalValue = MathUtils.lerp(
            this.headMesh.morphTargetInfluences[index] || 0,
            targetValue,
            VISEME_SMOOTHING
          );
          this.headMesh.morphTargetInfluences[index] = finalValue;
        }
      }
    );

    this.previousEmotionKeys = currentEmotionKeys;
  }

  /**
   * Calculates the blink value based on timing and state
   */
  private calculateBlinkValue(
    currentTime: number,
    blinkState: {
      isBlinking: boolean;
      lastBlinkTime: number;
      nextBlinkTime: number;
      blinkStartTime: number;
    },
    eyeBlink: boolean
  ): number {
    if (!eyeBlink) return 0;

    let blinkValue = 0;

    // Start new blink if it's time
    if (currentTime >= blinkState.nextBlinkTime && !blinkState.isBlinking) {
      blinkState.isBlinking = true;
      blinkState.blinkStartTime = currentTime;
      blinkState.lastBlinkTime = currentTime;
      blinkState.nextBlinkTime =
        currentTime +
        Math.random() * (BLINK_CONFIG.maxInterval - BLINK_CONFIG.minInterval) +
        BLINK_CONFIG.minInterval;
    }

    // Calculate blink animation progress
    if (blinkState.isBlinking) {
      const blinkProgress =
        (currentTime - blinkState.blinkStartTime) / BLINK_CONFIG.blinkDuration;
      
      // First half of blink - closing eyes
      if (blinkProgress <= 0.5) {
        blinkValue = blinkProgress * 2;
      } 
      // Second half of blink - opening eyes
      else if (blinkProgress <= 1) {
        blinkValue = 2 - blinkProgress * 2;
      } 
      // Blink complete
      else {
        blinkState.isBlinking = false;
        blinkValue = 0;
      }
    }

    return blinkValue;
  }
}
