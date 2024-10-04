import React, { useState, useEffect, useCallback } from 'react';
import AnimationControlPanel from './components/controls';
import FullbodyAvatar from './components/fullbodyAvatar';
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
  Loading: { weight: 0 },
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
  showControls,
  animation,
  loading,
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

  

  const onBaseActionChange = useCallback((action: string) => {

    // set the morph target influences for the given emotions
    if(action === 'Gioia1' || action === 'Gioia2' || action === 'Gioia3'){
      setMorphTargetInfluences({
        'eyesClosed': 0.5,
        'mouthSmile': 1,
      })
    }else if(action === 'Rabbia1' || action === 'Rabbia2' || action === 'Rabbia3'){
      setMorphTargetInfluences({
        'eyesClosed': 1,
        'mouthSmile': -0.5,
      })
    }else if(action === 'Sorpresa1' || action === 'Sorpresa2' || action === 'Sorpresa3'){
      setMorphTargetInfluences({
        'mouthSmile': 0.5,
        'eyesClosed': -0.5,
      })
    } else if(action === 'Tristezza1' || action === 'Tristezza2' || action === 'Tristezza3'){
      setMorphTargetInfluences({
        'mouthSmile': -0.6,
        'eyesClosed': 0.5,
      })
    } else if(action === 'Timore1' || action === 'Timore2' || action === 'Timore3'){
      setMorphTargetInfluences({
        'mouthSmile': -0.5,
        'eyesClosed': 1,
      })
    } else {
      setMorphTargetInfluences({
        'mouthSmile': 0,
        'eyesClosed': 0,
      })
    }
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

  useEffect(() => {
    if(loading){
      setMorphTargetInfluences({
        'mouthSmile': 0,
        'eyesClosed': 0,
      })
      setCurrentBaseAction({
        action: 'Loading',
        weight: 1,
      })
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
      {
        halfBody ? (
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
          />
        )
      }
    </>
  );
};
