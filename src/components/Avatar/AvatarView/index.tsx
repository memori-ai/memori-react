import { CSSProperties } from 'react';
import React, { Suspense } from 'react';
import FullbodyAvatar from './components/fullbodyAvatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';
import { useState, useEffect } from 'react';
import AnimationControlPanel from './components/controls';
import HalfBodyAvatar from './components/halfbodyAvatar';
import Loader from './components/loader';

interface BaseAction {
  weight: number;
  action?: string;
}

interface AdditiveAction {
  weight: number;
  action?: string;
}

const baseActions: Record<string, BaseAction> = {
  'Gioia1': { weight: 0 },
  'Gioia2': { weight: 0 },
  'Gioia3': { weight: 0 },
  'Idle1': { weight: 1 },
  'Idle2': { weight: 0 },
  'Idle3': { weight: 0 },
  'Idle4': { weight: 0 },
  'Idle5': { weight: 0 },
  Loading: { weight: 0 },
  'Rabbia1': { weight: 0 },
  'Rabbia2': { weight: 0 },
  'Rabbia3': { weight: 0 },
  'Sorpresa1': { weight: 0 },
  'Sorpresa2': { weight: 0 },
  'Sorpresa3': { weight: 0 },
  'Timore1': { weight: 0 },
  'Timore2': { weight: 0 },
  'Timore3': { weight: 0 },
  'Tristezza1': { weight: 0 },
  'Tristezza2': { weight: 0 },
  'Tristezza3': { weight: 0 },
};

export interface Props {
  url: string;
  sex: 'MALE' | 'FEMALE';
  fallbackImg?: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  rotateAvatar?: boolean;
  speaking?: boolean;
  style?: CSSProperties;
  fallback?: React.ReactNode;
  halfBody?: boolean;
  loading?: boolean;
  animation?: string;
  showControls?: boolean;
  isZoomed?: boolean;
}

const defaultStyles = {
  halfBody: {
    width: '100%',
    height: '100%',
    minHeight: '500px', // Ensure minimum height
    backgroundColor: 'white',
    borderRadius: '100%',
  },
  fullBody: {
    width: '500px',
    height: '500px',
    backgroundColor: 'white',
  },
};

/* Animation Control Panel */
const getCameraSettings = (halfBody: boolean, isZoomed?: boolean) =>
  halfBody
    ? {
        fov: 40,
        position: [0, 0, 0.6],
      }
    : !halfBody && isZoomed
    ? {
        // Zoomed in
        fov: 44,
        position: [0, 0, 1.25],
      }
    : { fov: 40, position: [0, 0.0000175, 3] };

const getLightingComponent = () =>
  isAndroid() || isiOS() ? (
    <SpotLight
      distance={100}
      position={[-0.3, 0.2, 1.25]}
      angle={Math.PI / 2}
      attenuation={5}
      anglePower={5}
    />
  ) : (
    <Environment files="https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/venice_sunset_1k.hdr" />
  );

const AvatarComponent = ({
  animation,
  loading,
  halfBody,
  ...props
}: Props & {
  halfBody: boolean;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  baseActions: Record<string, BaseAction>;
  additiveActions: Record<string, AdditiveAction>;
  timeScale: number;
  loading?: boolean;
  animation?: string;
  isZoomed?: boolean;
}) =>
  halfBody ? <HalfBodyAvatar {...props} /> : <FullbodyAvatar {...props} />;

const AvatarView = ({
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
}: Props & { halfBody: boolean }) => {
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: animation || 'Idle1',
    weight: 1,
  });

  const [additiveActions, setAdditiveActions] = useState({
    mouthSmile: { weight: 0 },
    eyesClosed: { weight: eyeBlink ? 1 : 0 },
    Rabbia: { weight: 0 },
    Sorpresa: { weight: 0 },
    Talk: { weight: speaking ? 1 : 0 },
    Timore: { weight: 0 },
    Tristezza: { weight: 0 },
    Gioria: { weight: 0 },
  });

  const [timeScale, setTimeScale] = useState(0.8);

  function onBaseActionChange(action: string) {
    setCurrentBaseAction({
      action,
      weight: 1,
    });
  }

  function onAdditiveActionChange(action: string, weight: number) {
    setAdditiveActions({
      ...additiveActions,
      [action]: { weight },
    });
  }

  function modifyTimeScale(value: number) {
    setTimeScale(value);
  }

  useEffect(() => {
    // If loading and not speaking, set to loading animation
    // if (loading && currentBaseAction.action !== 'Loading' && !speaking) {
    //   setCurrentBaseAction({
    //     action: 'Loading',
    //     weight: 1,
    //   });
    //   return;
    // }

    // Otherwise, if speaking, set to random talking animation
    if (speaking) {
      const talkingAnimations = ['Talk 1', 'Talk 2', 'Talk 3'];
      const randomIndex = Math.floor(Math.random() * talkingAnimations.length);
      const randomTalkingAnimation = talkingAnimations[randomIndex];

      setAdditiveActions({
        ...additiveActions,
        Talk: { weight: 1 },
      });

      setCurrentBaseAction({
        action: randomTalkingAnimation,
        weight: 1,
      });
    } else if (!speaking && additiveActions.Talk.weight !== 0) {
      // Otherwise, if not speaking, set to idle
      setAdditiveActions({
        ...additiveActions,
        Talk: { weight: 0 },
      });
      setCurrentBaseAction({
        action:  'Idle 1 - neutral',
        weight: 1,
      });
    }
  }, [speaking, loading]);

  return (
    <>
      {showControls && (
        <AnimationControlPanel
          timeScale={timeScale}
          onBaseActionChange={onBaseActionChange}
          onAdditiveActionChange={onAdditiveActionChange}
          baseActions={baseActions}
          additiveActions={additiveActions}
          currentBaseAction={currentBaseAction}
          modifyTimeScale={modifyTimeScale}
        />
      )}
      <AvatarComponent
        halfBody={halfBody}
        url={url}
        sex={sex}
        eyeBlink={eyeBlink}
        headMovement={headMovement}
        speaking={speaking}
        additiveActions={additiveActions}
        baseActions={baseActions}
        loading={loading || false}
        currentBaseAction={currentBaseAction}
        timeScale={timeScale}
        animation={animation}
        isZoomed={isZoomed}
      />
    </>
  );
};

export default function ContainerAvatarView({
  url,
  sex,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  speaking,
  fallback,
  fallbackImg,
  halfBody = true,
  loading,
  animation,
  showControls = true,
  isZoomed,
}: Props) {
  return (
    <Canvas
      style={
        style || (halfBody ? defaultStyles.halfBody : defaultStyles.fullBody)
      }
      camera={getCameraSettings(halfBody, isZoomed) as any}
    >
      <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />}>
        {getLightingComponent()}
        {rotateAvatar && <OrbitControls enablePan={false} enableZoom={false} />}
        <AvatarView
          halfBody={halfBody}
          url={url}
          sex={sex}
          eyeBlink={eyeBlink}
          headMovement={headMovement}
          speaking={speaking}
          loading={loading}
          animation={animation}
          showControls={showControls}
          isZoomed={isZoomed}
        />
      </Suspense>
    </Canvas>
  );
}
