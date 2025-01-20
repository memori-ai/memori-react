// Import required dependencies
import React, { useState, useEffect, useCallback } from 'react';
import AnimationControlPanel from './components/controls';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
import {
  BASE_ACTIONS,
  EMOTION_MAP_CUSTOM_GLB,
  MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB,
  MAPPING_BLEND_SHAPE_TO_EMOTION_RPM,
} from './constants';

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
  showControls,
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
  // State management for avatar animations and morphing
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: animation || 'Idle1',
    weight: 1,
  });
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
    (outputContent: string) => {
      return MAPPING_BLEND_SHAPE_TO_EMOTION_RPM[
        outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_RPM
      ];
    },
    []
  );

  const handleCustomGLBBlendShape = useCallback(
    (outputContent: string) => {
      return MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB[
        outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB
      ];
    },
    []
  );

  // Handler for setting emotion morph target influences, used for RPM and GLB blend shapes
  const setEmotionMorphTargetInfluences = useCallback(
    (action: string, outputContent: string) => {
      // console.log('[AvatarView] Setting emotion influences:', { action, outputContent });
      
      if (action.startsWith('Loading')) return;
  
      const defaultEmotions = getDefaultEmotions();
      // console.log('[AvatarView] Default emotions state:', defaultEmotions);
  
      if (!outputContent || outputContent === 'default') {
        setEmotionMorphTargets(defaultEmotions);
        return;
      }
  
      if (isRPM) {
        const blendShapes = handleRPMBlendShape(outputContent);
        if (blendShapes) {
          setEmotionMorphTargets(_ => ({ ...defaultEmotions, ...blendShapes }));
        } else {
          setEmotionMorphTargets(defaultEmotions);
        }
      } else {
        const emotionName = handleCustomGLBBlendShape(outputContent);
        console.log('[AvatarView] Emotion mapping:', {
          input: outputContent,
          mapped: emotionName
        });
  
        // Create the direct emotion mapping - key should match the morph target name
        const emotionValue = { [emotionName]: 1 };
        // console.log('[AvatarView] Setting direct emotion:', emotionValue);
        
        setEmotionMorphTargets(_ => ({ ...defaultEmotions, ...emotionValue }));
      }
    },
    [isRPM, handleRPMBlendShape, handleCustomGLBBlendShape]
  );

  // Callback handlers for various avatar state changes
  const onBaseActionChange = useCallback(
    (action: string, outputContent: string) => {
      setEmotionMorphTargetInfluences(action, outputContent);
      setCurrentBaseAction({ action, weight: 1 });
    },
    [setEmotionMorphTargetInfluences]
  );

  const onMorphTargetInfluencesChange = useCallback(
    (influences: Record<string, number>) => {
      setMorphTargetInfluences(prev => ({ ...prev, ...influences }));
    },
    []
  );

  const onMorphTargetDictionaryChange = useCallback(
    (dictionary: Record<string, number>) => {
      setMorphTargetDictionary(dictionary);
    },
    []
  );

  // Effect to handle animation changes based on loading state and chat emissions
  useEffect(() => {
    if (loading) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      onBaseActionChange(`Loading${randomNumber}`, '');
      return;
    }

    const hasOutputTagEmotion = chatEmission?.includes(
      '<output class="memori-emotion">'
    );
    const outputContentEmotion = hasOutputTagEmotion
      ? chatEmission
          ?.split('<output class="memori-emotion">')[1]
          ?.split('</output>')[0]
          ?.trim()
      : null;

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
      onBaseActionChange(outputContentSequence, outputContentSequence);
    } else if (outputContentEmotion) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      onBaseActionChange(
        `${outputContentEmotion}${randomNumber}`,
        outputContentEmotion
      );
    } else {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      onBaseActionChange(`Idle${randomNumber === 3 ? 4 : randomNumber}`, '');
    }
  }, [chatEmission, loading, onBaseActionChange]);

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
      {showControls && (
        <AnimationControlPanel
          timeScale={timeScale}
          morphTargetDictionary={morphTargetDictionary}
          onBaseActionChange={onBaseActionChange}
          onMorphTargetInfluencesChange={onMorphTargetInfluencesChange}
          onMorphTargetDictionaryChange={onMorphTargetDictionaryChange}
          baseActions={BASE_ACTIONS}
          currentBaseAction={currentBaseAction}
          modifyTimeScale={setTimeScale}
        />
      )}

      {halfBody ? (
        <HalfBodyAvatar {...commonAvatarProps} headMovement={headMovement} />
      ) : (
        <FullbodyAvatar
          {...commonAvatarProps}
          sex={sex}
          setIsRpm={setIsRPM}
          resetVisemeQueue={resetVisemeQueue}
          eyeBlink={eyeBlink}
          currentBaseAction={currentBaseAction}
          timeScale={timeScale}
          morphTargetInfluences={morphTargetInfluences}
          stopProcessing={stopProcessing}
          emotionMorphTargets={emotionMorphTargets}
          halfBody={halfBody}
        />
      )}
    </>
  );
};
