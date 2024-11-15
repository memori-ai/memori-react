import React, { useState, useEffect, useCallback } from 'react';
import AnimationControlPanel from './components/controls';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar'
import HalfBodyAvatar from './components/halfbodyAvatar';

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
  Loading1: { weight: 0 },
  Loading2: { weight: 0 },
  Loading3: { weight: 0 },
};

export const AvatarView: React.FC<Props & { halfBody: boolean }> = ({
  stopProcessing,
  chatEmission,
  showControls,
  animation,
  url,
  sex,
  eyeBlink,
  headMovement,
  // speaking,
  halfBody,
  loading,
  // isZoomed,
  avatarHeight,
  avatarDepth,
  updateCurrentViseme,
  resetVisemeQueue,
  setCameraZ,
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
  const [emotionMorphTargets, setEmotionMorphTargets] = useState<{
    [key: string]: number;
  }>({});

  const [timeScale, setTimeScale] = useState(0.8);

  // Set the morph target influences for the given emotions
  const setEmotionMorphTargetInfluences = useCallback((action: string) => {
    if (
      action === 'Loading1' ||
      action === 'Loading2' ||
      action === 'Loading3'
    ) {
      return;
    }

    const emotionMap: Record<string, Record<string, number>> = {
      Gioia: { Gioria: 1 },
      Rabbia: { Rabbia: 1 },
      Sorpresa: { Sorpresa: 1 },
      Tristezza: { Tristezza: 1 },
      Timore: { Timore: 1 },
    };

    // Set all emotions to 0
    const defaultEmotions = Object.keys(emotionMap).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    // Find the emotion that matches the action
    const emotion =
      Object.keys(emotionMap).find(key => action.startsWith(key)) || 'default';

    // Set the emotion values
    const emotionValues =
      emotion === 'default' ? defaultEmotions : emotionMap[emotion];

    setEmotionMorphTargets(_ => ({
      ...defaultEmotions,
      ...emotionValues,
    }));
  }, []);

  const onBaseActionChange = useCallback((action: string) => {
    setEmotionMorphTargetInfluences(action);
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
    } else {
      //Set a random idle animation
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const animation = `Idle${randomNumber === 3 ? 4 : randomNumber}`;
      onBaseActionChange(animation);
    }
  }, [chatEmission]);

  useEffect(() => {
    if (loading) {
      //Choose a random number between 1 and 3
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      const animation = `Loading${randomNumber}`;
      onBaseActionChange(animation);
    }
  }, [loading]);

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
          onCameraZChange={setCameraZ}
          setMorphTargetInfluences={setMorphTargetInfluences}
          setMorphTargetDictionary={setMorphTargetDictionary}
          updateCurrentViseme={updateCurrentViseme}
          avatarHeight={avatarHeight || 50}
          avatarDepth={avatarDepth || -50}
          headMovement={headMovement}
        />
      ) : (
        <FullbodyAvatar
          url={url}
          sex={sex}
          resetVisemeQueue={resetVisemeQueue}
          eyeBlink={eyeBlink}
          currentBaseAction={currentBaseAction}
          timeScale={timeScale}
          morphTargetInfluences={morphTargetInfluences}
          updateCurrentViseme={updateCurrentViseme}
          stopProcessing={stopProcessing}
          setMorphTargetDictionary={setMorphTargetDictionary}
          setMorphTargetInfluences={setMorphTargetInfluences}
          emotionMorphTargets={emotionMorphTargets}
          halfBody={halfBody}
          onCameraZChange={setCameraZ}
          avatarHeight={avatarHeight || 50}
          avatarDepth={avatarDepth || -50}
        />
      )}
    </>
  );
};
