import { SkinnedMesh } from 'three';
import { MathUtils } from 'three';
import { EMOTION_SMOOTHING, VISEME_SMOOTHING, BLINK_CONFIG } from '../../constants';

/**
 * Type definitions for blend shape mapping
 */
interface BlendShapeMap {
  [key: string]: Record<string, number>;
}

/**
 * Interface for emotion mapping
 */
interface EmotionMapping {
  [key: string]: string;
}

/**
 * Controller class for handling morph target animations including emotions, visemes and blinking
 */
export class MorphTargetController {
  private headMesh: SkinnedMesh;
  private currentEmotionValues: Record<string, number> = {};
  private previousEmotionKeys: Set<string> = new Set();
  private isRPM: boolean = false;
  
  // Default RPM blend shape mappings
  private rpmBlendShapes: BlendShapeMap = {
    Rabbia: {
      'browDownLeft': 0.5,
      'browDownRight': 0.5,
      'browOuterUpLeft': 0.5,
      'browOuterUpRight': 0.5,
      'mouthSmile': -0.2,
    },
    Timore: {
      'browOuterUpLeft': -0.5,
      'browOuterUpRight': -0.5,
      'eyeWideLeft': -0.5,
      'eyeWideRight': -0.5,
    },
    Tristezza: {
      'browDownLeft': -0.5,
      'browDownRight': -0.5,
      'eyeSquintLeft': 0.5,
      'eyeSquintRight': 0.5,
      'mouthSmile': -0.6,
    },
    Sorpresa: {
      'browInnerUp': 0.5,
      'browOuterUpLeft': 0.5,
      'browOuterUpRight': 0.5,
      'eyeWideLeft': 0.5,
      'eyeWideRight': 0.5,
    },
    Gioia: {
      'browDownLeft': 0.5,
      'browDownRight': 0.5,
      'browInnerUp': 0.5,
      'mouthSmile': 0.8,
    }
  };
  
  // Default custom GLB emotion mappings
  private customGlbMapping: EmotionMapping = {
    Gioia: 'Joy',
    Rabbia: 'Anger',
    Sorpresa: 'Surprise',
    Tristezza: 'Sadness',
    Timore: 'Fear',
  };

  /**
   * Constructor for MorphTargetController
   * @param headMesh SkinnedMesh representing the head
   * @param rpmBlendShapes Optional custom RPM blend shapes
   * @param customGlbMapping Optional custom GLB emotion mapping
   */
  constructor(
    headMesh: SkinnedMesh, 
    rpmBlendShapes?: BlendShapeMap,
    customGlbMapping?: EmotionMapping
  ) {
    this.headMesh = headMesh;
    
    // Detect if this is an RPM avatar based on mesh name
    this.isRPM = headMesh.name !== 'GBNL__Head';
    
    // Override default maps if provided
    if (rpmBlendShapes) {
      this.rpmBlendShapes = rpmBlendShapes;
    }
    
    if (customGlbMapping) {
      this.customGlbMapping = customGlbMapping;
    }
  }

  /**
   * Process chat emission to extract emotion data
   * @param chatEmission Chat emission text
   * @param isLoading Loading state
   * @returns Object with emotion morph targets
   */
  processChatEmission(chatEmission: any, isLoading: boolean): Record<string, number> {
    // Default empty emotion targets
    const defaultEmotions = this.getDefaultEmotionMorphTargets();
    
    // If loading or no chat emission, return default emotions
    if (isLoading || !chatEmission) {
      return defaultEmotions;
    }
    
    // Check if chat emission contains emotion tag
    const hasOutputTagEmotion = chatEmission?.includes(
      '<output class="memori-emotion">'
    );
    
    if (!hasOutputTagEmotion) {
      return defaultEmotions;
    }
    
    // Extract emotion name
    const outputContentEmotion = chatEmission
      ?.split('<output class="memori-emotion">')[1]
      ?.split('</output>')[0]
      ?.trim();
    
    if (!outputContentEmotion) {
      return defaultEmotions;
    }
    
    // Process emotion based on avatar type
    return this.processEmotion(outputContentEmotion);
  }
  
  /**
   * Process an emotion name into morph target values
   * @param emotionName Emotion name (in Italian)
   * @returns Object with morph target values
   */
  private processEmotion(emotionName: string): Record<string, number> {
    // Get default empty emotion targets
    const defaultEmotions = this.getDefaultEmotionMorphTargets();
    
    // Handle RPM avatars differently from custom GLB
    if (this.isRPM) {
      // Get blend shapes for this emotion
      const blendShapes = this.rpmBlendShapes[emotionName] || {};
      return { ...defaultEmotions, ...blendShapes };
    } else {
      // For custom GLB, map to English emotion name
      const englishEmotion = this.customGlbMapping[emotionName] || '';
      if (englishEmotion) {
        // Set only the mapped emotion to 1, leave others at 0
        return { ...defaultEmotions, [englishEmotion]: 1 };
      }
    }
    
    return defaultEmotions;
  }
  
  /**
   * Get default emotion morph targets (all set to 0)
   */
  private getDefaultEmotionMorphTargets(): Record<string, number> {
    // For RPM, use blend shape keys
    if (this.isRPM) {
      const allBlendShapeKeys = new Set<string>();
      Object.values(this.rpmBlendShapes).forEach(blendShapes => {
        Object.keys(blendShapes).forEach(key => allBlendShapeKeys.add(key));
      });
      
      return Array.from(allBlendShapeKeys).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {}
      );
    } 
    // For custom GLB, use English emotion names
    else {
      return Object.values(this.customGlbMapping).reduce(
        (acc, emotion) => ({ ...acc, [emotion]: 0 }),
        {}
      );
    }
  }

  /**
   * Updates the morph target influences for emotions, visemes and blinking
   */
  updateMorphTargets(
    currentTime: number,
    chatEmission: any,
    isLoading: boolean,
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

    // Process chat emission to get emotion morph targets
    const emotionMorphTargets = this.processChatEmission(chatEmission, isLoading);

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