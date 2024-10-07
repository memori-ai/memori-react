import React, { useState, useEffect, useCallback } from 'react';
import AnimationControlPanel from './components/controls';
import FullbodyAvatar from './components/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
import { useViseme } from '../utils/useViseme';

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
}

interface BaseAction {
  weight: number;
  action?: string;
}

const baseActions: Record<string, BaseAction> = {
  Gioia1: { weight: 0 },
  Gioia2: { weight: 0 },
  Gioia3: { weight: 0 },
  Idle1: { weight: 1 },
  Idle2: { weight: 0 },
  Idle3: { weight: 0 },
  Idle4: { weight: 0 },
  Idle5: { weight: 0 },
  Rabbia1: { weight: 0 },
  Rabbia2: { weight: 0 },
  Rabbia3: { weight: 0 },
  Sorpresa1: { weight: 0 },
  Sorpresa2: { weight: 0 },
  Sorpresa3: { weight: 0 },
  Timore1: { weight: 0 },
  Timore2: { weight: 0 },
  Timore3: { weight: 0 },
  Tristezza1: { weight: 0 },
  Tristezza2: { weight: 0 },
  Tristezza3: { weight: 0 },
};

export const AvatarView: React.FC<Props & { halfBody: boolean }> = ({
  chatEmission,
  showControls,
  animation,
 // loading,
  url,
  sex,
  eyeBlink,
  headMovement,
  speaking,
  halfBody,
  isZoomed,
}) => {
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: animation || 'Idle1',
    weight: 1,
  });

  const [morphTargetInfluences, setMorphTargetInfluences] = useState<{
    [key: string]: number;
  }>({});
  const [morphTargetDictionary, setMorphTargetDictionary] = useState<{
    [key: string]: number;
  }>({});

  const [timeScale, setTimeScale] = useState(0.8);

  const { createVisemeSequence, currentVisemes, clearVisemes } = useViseme();

  // Set the morph target influences for the given emotions
  const setEmotion = useCallback((action: string) => {
    const emotionMap: Record<string, Record<string, number>> = {
      Gioia: { Gioria: 1 },
      Rabbia: { Rabbia: 1 },
      Sorpresa: { Sorpresa: 1 },
      Tristezza: { Tristezza: 1 },
      Timore: { Timore: 1 },
    };

    const defaultEmotions = Object.keys(emotionMap).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    const emotion = Object.keys(emotionMap).find(key => action.startsWith(key)) || 'default';
    const emotionValues = emotion === 'default' ? defaultEmotions : emotionMap[emotion];

    setMorphTargetInfluences(prevInfluences => ({
      ...prevInfluences,
      ...defaultEmotions,
      ...emotionValues
    }));
  }, []);

  const onBaseActionChange = useCallback((action: string) => {
    setEmotion(action);
    setCurrentBaseAction({
      action,
      weight: 1,
    });
  }, []);

  const onMorphTargetInfluencesChange = useCallback(
    (influences: { [key: string]: number }) => {
      setMorphTargetInfluences(prevInfluences => ({
        ...prevInfluences,
        ...influences,
      }));
    },
    []
  );

  const onMorphTargetDictionaryChange = useCallback(
    (dictionary: { [key: string]: number }) => {
      setMorphTargetDictionary(dictionary);
    },
    []
  );

  const modifyTimeScale = useCallback((value: number) => {
    setTimeScale(value);
  }, []);

  // Set the emotion based on the chatEmission
  useEffect(() => {
    if (chatEmission) {
      createVisemeSequence(chatEmission);
    }

    //Check if chatEmission has a tag
    const hasOutputTag = chatEmission?.includes(
      '<output class="memori-emotion">'
    );
    const outputContent = hasOutputTag
      ? chatEmission
          ?.split('<output class="memori-emotion">')[1]
          ?.split('</output>')[0]
          ?.trim()
      : null;

    if (outputContent) {
      //Based on the outputContent, set the emotion
      //The outputContent could be: "Gioia", "Sorpresa", "Tristezza", "Rabbia", "Timore"
      //Choose a random number between 1 and 3
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      const emotion = `${outputContent}${randomNumber}`;

      onBaseActionChange(emotion);
    }
  }, [chatEmission]);

  const resetToIdle = useCallback(() => {
    const randomIdle = Math.floor(Math.random() * 5) + 1;
    setCurrentBaseAction({
      action: `Idle${randomIdle}`,
      weight: 1,
    });
    setMorphTargetInfluences({ mouthSmile: 0, eyesClosed: 0 });
  }, []);


  //Set a loading state to true if the avatar is loading
  // useEffect(() => {
  //   if (loading) {
  //     resetToIdle();
  //   }
  // }, [loading]);

  return (
    <>
      {showControls && (
        <AnimationControlPanel
          timeScale={timeScale}
          morphTargetDictionary={morphTargetDictionary}
          onBaseActionChange={onBaseActionChange}
          onMorphTargetInfluencesChange={onMorphTargetInfluencesChange}
          onMorphTargetDictionaryChange={onMorphTargetDictionaryChange}
          baseActions={baseActions}
          currentBaseAction={currentBaseAction}
          modifyTimeScale={modifyTimeScale}
        />
      )}
      {halfBody ? (
        <HalfBodyAvatar
          url={url}
          setMorphTargetInfluences={setMorphTargetInfluences}
          headMovement={headMovement}
          speaking={speaking}
        />
      ) : (
        <FullbodyAvatar
          url={url}
          sex={sex}
          eyeBlink={eyeBlink}
          speaking={speaking}
          currentBaseAction={currentBaseAction}
          timeScale={timeScale}
          setMorphTargetInfluences={setMorphTargetInfluences}
          setMorphTargetDictionary={setMorphTargetDictionary}
          morphTargetInfluences={morphTargetInfluences}
          morphTargetDictionary={morphTargetDictionary}
          isZoomed={isZoomed}
          currentVisemes={currentVisemes}
        />
      )}
    </>
  );
};
