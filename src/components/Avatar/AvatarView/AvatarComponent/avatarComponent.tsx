// Import required dependencies
import React, { useState, useEffect, useCallback } from 'react';
import AnimationControlPanel from './components/controls';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
import {
  BASE_ACTIONS,
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
  updateCurrentViseme: (currentTime: number) => { name: string; weight: number } | null;
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
  const [morphTargetInfluences, setMorphTargetInfluences] = useState<Record<string, number>>({});
  const [morphTargetDictionary, setMorphTargetDictionary] = useState<Record<string, number>>({});
  const [emotionMorphTargets, setEmotionMorphTargets] = useState<Record<string, number>>({});
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
    Object.keys(emotionMap).reduce((acc, key) => ({...acc, [key]: 0}), {});

  // Handlers for different blend shape types
  const handleRPMBlendShape = useCallback((outputContent: string) => 
    MAPPING_BLEND_SHAPE_TO_EMOTION_RPM[outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_RPM],
  []);

  const handleCustomGLBBlendShape = useCallback((outputContent: string) => 
    MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB[outputContent as keyof typeof MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB],
  []);

  // Handler for setting emotion morph target influences, used for RPM and GLB blend shapes
  const setEmotionMorphTargetInfluences = useCallback((action: string, outputContent: string) => {
    if (action.startsWith('Loading')) return;

    const defaultEmotions = getDefaultEmotions();

    // If output content is default, set default emotions
    if (outputContent === 'default') {
      setEmotionMorphTargets(defaultEmotions);
      return;
    }

    // If RPM, convert blend shape to emotion
    /*examples of RPM blend shapes are:
    * browDownLeft
    * browDownRight
    * browUpLeft
    * browUpRight
    *
    * being converted to:
    * Anger
    * Joy
    * Surprise
    * Sadness
    * Fear
    */ 
    if (isRPM) {
      const emotion = handleRPMBlendShape(outputContent);
      setEmotionMorphTargets((_) => ({...defaultEmotions, ...emotion}));
    } else {
      // If GLB, convert italian emotions to english ones
      /*examples of GLB blend shapes are:
      * Rabbia
      * Felicità
      * Surpresa
      * Tristezza
      * Paura
      * 
      * being converted to:
      * Anger
      * Joy
      * Surprise
      * Sadness
      * Fear
      */
      const emotion = handleCustomGLBBlendShape(outputContent);
      const emotionValues = emotion === 'default' ? defaultEmotions : emotionMap[emotion];
      setEmotionMorphTargets((_) => ({...defaultEmotions, ...emotionValues}));
    }
  }, [isRPM, handleRPMBlendShape, handleCustomGLBBlendShape]);

  // Callback handlers for various avatar state changes
  const onBaseActionChange = useCallback((action: string, outputContent: string) => {

    // Set emotion morph target influences
    setEmotionMorphTargetInfluences(action, outputContent);

    // Set current base action
    setCurrentBaseAction({action, weight: 1});
  }, [setEmotionMorphTargetInfluences]);

  const onMorphTargetInfluencesChange = useCallback((influences: Record<string, number>) => {
    // Set morph target influences
    setMorphTargetInfluences(prev => ({...prev, ...influences}));
  }, []);

  const onMorphTargetDictionaryChange = useCallback((dictionary: Record<string, number>) => {
    // Set morph target dictionary
    setMorphTargetDictionary(dictionary);
  }, []);

  // Effect to handle animation changes based on loading state and chat emissions
  useEffect(() => {

    // If loading, set a random loading animation
    if (loading) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      onBaseActionChange(`Loading${randomNumber}`, '');
      return;
    }

    // If there's chat emission, set the corresponding emotion animation
    const hasOutputTag = chatEmission?.includes('<output class="memori-emotion">');
    const outputContent = hasOutputTag
      ? chatEmission?.split('<output class="memori-emotion">')[1]?.split('</output>')[0]?.trim()
      : null;

    // If there's an emotion, set the corresponding animation
    if (outputContent) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      onBaseActionChange(`${outputContent}${randomNumber}`, outputContent);
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
        <HalfBodyAvatar
          {...commonAvatarProps}
          headMovement={headMovement}
        />
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
