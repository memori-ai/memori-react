// Import required dependencies
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AnimationControlPanel from './components/controls';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
import { AvatarAnimator } from './components/controllers/animations/AvatarAnimator';
import {
  MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB,
  MAPPING_BLEND_SHAPE_TO_EMOTION_RPM,
  ANIMATION_URLS
} from './constants';

// Animation source configuration for the animator
const ANIMATION_SOURCES = {
  'IDLE': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['MALE'], // Use existing animation URLs
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  },
  'LOADING': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['MALE'],
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  },
  'ACTION': {
    primary: 'avatar',
    fallbacks: {
      'RPM': ANIMATION_URLS['MALE'],
      'CUSTOM_GLB': ANIMATION_URLS['FEMALE']
    }
  }
};

// Props interface for AvatarView component
interface Props {
  showControls: boolean;
  animation?: string;
  loading: boolean;
  url: string;
  sex: 'MALE' | 'FEMALE';
  eyeBlink: boolean;
  headMovement: boolean;
  speaking: boolean;
  isZoomed: boolean;
  chatEmission: any;
  avatarHeight?: number;
  avatarDepth?: number;
  stopProcessing: () => void;
  resetVisemeQueue: () => void;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
  setCameraZ: (value: number) => void;
}

/**
 * AvatarView Component
 * Renders either a full body or half body 3D avatar with animations and morphing capabilities
 */
export const AvatarView: React.FC<Props & { halfBody: boolean }> = ({
  stopProcessing,
  chatEmission,
  // showControls,
  animation,
  url,
  sex,
  eyeBlink,
  headMovement,
  halfBody,
  loading,
  avatarHeight = 50,
  avatarDepth = -50,
  updateCurrentViseme,
  resetVisemeQueue,
  setCameraZ,
}) => {
  // Reference to the AvatarAnimator instance
  const animatorRef = useRef<AvatarAnimator | null>(null);
  
  // State management for avatar animations and morphing
  const [morphTargetInfluences, setMorphTargetInfluences] = useState<
    Record<string, number>
  >({});
  const [morphTargetDictionary, setMorphTargetDictionary] = useState<
    Record<string, number>
  >({});
  const [emotionMorphTargets, setEmotionMorphTargets] = useState<
    Record<string, number>
  >({});
  const [isRPM, setIsRPM] = useState(false);
  const [timeScale, setTimeScale] = useState(0.8);
  const [animationList, setAnimationList] = useState<string[]>([]);
  
  // Track current animation for UI purposes
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: animation || 'Idle1',
    weight: 1,
  });

  // Map of basic emotions with their corresponding morph values
  const emotionMap: Record<string, Record<string, number>> = {
    Joy: { Joy: 1 },
    Anger: { Anger: 1 },
    Surprise: { Surprise: 1 },
    Sadness: { Sadness: 1 },
    Fear: { Fear: 1 },
  };

  // Helper function to get default emotion state (all set to 0)
  const getDefaultEmotions = () =>
    Object.keys(emotionMap).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  // Handlers for different blend shape types
  const handleRPMBlendShape = useCallback(
    (outputContent: string) =>
      MAPPING_BLEND_SHAPE_TO_EMOTION_RPM[
        outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_RPM
      ],
    []
  );

  const handleCustomGLBBlendShape = useCallback(
    (outputContent: string) =>
      MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB[
        outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB
      ],
    []
  );

  // Handler for setting emotion morph target influences, used for RPM and GLB blend shapes
  const setEmotionMorphTargetInfluences = useCallback(
    (action: string, outputContent: string) => {
      if (action.startsWith('Loading')) return;

      const defaultEmotions = getDefaultEmotions();

      // If output content is default, set default emotions
      if (outputContent === 'default') {
        setEmotionMorphTargets(defaultEmotions);
        return;
      }

      // If RPM, convert emotion to blend shape
      if (isRPM) {
        const emotion = handleRPMBlendShape(outputContent);
        setEmotionMorphTargets(_ => ({ ...defaultEmotions, ...emotion }));
      } else {
        // If GLB, convert italian emotions to english ones
        const emotion = handleCustomGLBBlendShape(outputContent);
        const emotionValues =
          emotion === 'default' ? defaultEmotions : emotionMap[emotion];
        setEmotionMorphTargets(_ => ({ ...defaultEmotions, ...emotionValues }));
      }
    },
    [isRPM, handleRPMBlendShape, handleCustomGLBBlendShape]
  );

  // New function to handle animator initialization
  const handleAnimatorReady = useCallback((animator: AvatarAnimator) => {
    // Store reference
    animatorRef.current = animator;
    
    // Set time scale
    animator.setTimeScale(timeScale);
    
    // Register animation events
    animator.on('start', (data) => {
      console.log(`[AvatarAnimator] Animation started: ${data.animation}`);
      
      // Update UI state to reflect current animation
      setCurrentBaseAction({
        action: data.animation,
        weight: 1
      });
      
      // Handle emotion morphing if needed
      if (data.animation && !data.animation.startsWith('Loading') && !data.animation.startsWith('Idle')) {
        // Extract emotion name from animation (e.g., Joy1 -> Joy)
        const emotionName = data.animation.replace(/\d+$/, '');
        setEmotionMorphTargetInfluences(data.animation, emotionName);
      } else if (data.animation.startsWith('Idle')) {
        // Reset emotions for idle
        setEmotionMorphTargetInfluences(data.animation, 'default');
      }
    });
    
    // Get list of available animations for control panel
    setAnimationList(animator.getAllAnimationNames());
  }, [timeScale, setEmotionMorphTargetInfluences]);

  // Callback handlers for various avatar state changes
  const onBaseActionChange = useCallback(
    (action: string, outputContent: string) => {
      if (!animatorRef.current) return;
      
      // Set emotion morph target influences
      setEmotionMorphTargetInfluences(action, outputContent);
      
      // Using new animator API
      if (action.includes('->')) {
        // It's a sequence
        animatorRef.current.execute(action);
      } else {
        // Single animation
        animatorRef.current.play(action);
      }
      
      // Update UI state (actual animation state is managed by animator)
      setCurrentBaseAction({ action, weight: 1 });
    },
    [setEmotionMorphTargetInfluences]
  );

  const onMorphTargetInfluencesChange = useCallback(
    (influences: Record<string, number>) => {
      // Set morph target influences
      setMorphTargetInfluences(prev => ({ ...prev, ...influences }));
    },
    []
  );

  const onMorphTargetDictionaryChange = useCallback(
    (dictionary: Record<string, number>) => {
      // Set morph target dictionary
      setMorphTargetDictionary(dictionary);
    },
    []
  );

  // Effect to handle animation changes based on loading state and chat emissions
  useEffect(() => {
    if (!animatorRef.current) return;
    
    // If loading, set a random loading animation
    if (loading) {
      animatorRef.current.loading();
      return;
    }

    // Check if chat emission contains animation control
    const hasOutputTagEmotion = chatEmission?.includes(
      '<output class="memori-emotion">'
    );
    const outputContentEmotion = hasOutputTagEmotion
      ? chatEmission
          ?.split('<output class="memori-emotion">')[1]
          ?.split('</output>')[0]
          ?.trim()
      : null;

    // Check if chat emission contains animation sequence
    const hasOutputTagSequence = chatEmission?.includes(
      '<output class="animation-sequence">'
    );
    const outputContentSequence = hasOutputTagSequence
      ? chatEmission
          ?.split('<output class="animation-sequence">')[1]
          ?.split('</output>')[0]
          ?.trim()
      : null;

    if (outputContentSequence && outputContentSequence.includes('->')) {
      // It's a sequence
      animatorRef.current.execute(outputContentSequence);
      // Also update emotion morphing
      setEmotionMorphTargetInfluences(outputContentSequence, outputContentSequence);
    } else if (outputContentEmotion) {
      console.log('[AvatarView] outputContentEmotion:', outputContentEmotion);
      // It's an emotion - randomize between variants
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      const animationName = `${outputContentEmotion}${randomNumber}`;
      animatorRef.current.play(animationName);
      // Also update emotion morphing
      setEmotionMorphTargetInfluences(animationName, outputContentEmotion);
    } else {
      // Default to idle
      animatorRef.current.idle();
      // Reset emotions
      setEmotionMorphTargetInfluences('Idle', 'default');
    }
  }, [chatEmission, loading, setEmotionMorphTargetInfluences]);

  // Update time scale when it changes
  useEffect(() => {
    if (animatorRef.current) {
      animatorRef.current.setTimeScale(timeScale);
    }
  }, [timeScale]);

  // Common props shared between full body and half body avatars
  const commonAvatarProps = {
    url,
    onCameraZChange: setCameraZ,
    setMorphTargetInfluences,
    setMorphTargetDictionary,
    updateCurrentViseme,
    avatarHeight,
    avatarDepth,
  };

  // Render avatar with controls
  return (
    <>
      {/* {showControls && (
        <AnimationControlPanel
          timeScale={timeScale}
          morphTargetDictionary={morphTargetDictionary}
          onBaseActionChange={onBaseActionChange}
          onMorphTargetInfluencesChange={onMorphTargetInfluencesChange}
          onMorphTargetDictionaryChange={onMorphTargetDictionaryChange}
          baseActions={[]}
          currentBaseAction={currentBaseAction}
          modifyTimeScale={setTimeScale}
        />
      )} */}

      {halfBody ? (
        <HalfBodyAvatar {...commonAvatarProps} headMovement={headMovement} />
      ) : (
        <FullbodyAvatar
          {...commonAvatarProps}
          sex={sex}
          setIsRpm={setIsRPM}
          resetVisemeQueue={resetVisemeQueue}
          eyeBlink={eyeBlink}
          // For backwards compatibility, pass currentBaseAction
          // but main animation control is now done through animator
          currentBaseAction={currentBaseAction}
          timeScale={timeScale}
          setMorphTargetInfluences={setMorphTargetInfluences}
          stopProcessing={stopProcessing}
          emotionMorphTargets={emotionMorphTargets}
          animationSources={ANIMATION_SOURCES}
          onAnimatorReady={handleAnimatorReady}
        />
      )}
    </>
  );
};