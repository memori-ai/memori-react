import { CSSProperties, useRef } from 'react';
import React, { Suspense } from 'react';
import Avatar from './components/halfbodyAvatar';
import FullbodyAvatar, {
  FullbodyAvatarProps,
} from './components/fullbodyAvatar';
import Loader from './components/loader';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';
import { useThree } from '@react-three/fiber';
import { useState, useEffect, useCallback } from 'react';
import { GUI } from 'lil-gui';
import AnimationControlPanel from './components/controls';
import HalfBodyAvatar from './components/halfbodyAvatar';

interface BaseAction {
  weight: number;
  action?: string;
}

interface AdditiveAction {
  weight: number;
  action?: string;
}

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
}

const baseActions: Record<string, BaseAction> = {
  Idle: { weight: 1 },
  'Idle 1': { weight: 0 },
  'Idle 2': { weight: 0 },
  'Idle 3': { weight: 0 },
  Loading: { weight: 0 },
  Sad: { weight: 0 },
  'Talk 1': { weight: 0 },
  'Talk 2': { weight: 0 },
  'Talk 3': { weight: 0 },
};

const defaultStyles = {
  halfBody: {
    width: '250px',
    height: '250px',
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
const getCameraSettings = (halfBody: boolean) =>
  halfBody
    ? {
        fov: 40,
        position: [0, 0, 0.6],
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
}) =>
  halfBody ? <HalfBodyAvatar {...props} /> : <FullbodyAvatar {...props} />;

const AvatarView = ({
  animation,
  loading,
  url,
  sex,
  eyeBlink,
  headMovement,
  speaking,
  halfBody,
}: Props & { halfBody: boolean }) => {
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: animation || 'Idle',
    weight: 1,
  });

  const [additiveActions, setAdditiveActions] = useState({
    smile: { weight: 0 },
    blink: { weight: eyeBlink ? 1 : 0 },
    speak: { weight: speaking ? 1 : 0 },
    headMovement: { weight: headMovement ? 1 : 0 },
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
    if (loading && currentBaseAction.action !== 'Loading' && !speaking) {
      setCurrentBaseAction({
        action: 'Loading',
        weight: 1,
      });
      return;
    }

    // Otherwise, if speaking, set to random talking animation
    if (speaking) {
      const talkingAnimations = ['Talk 1', 'Talk 2', 'Talk 3'];
      const randomIndex = Math.floor(Math.random() * talkingAnimations.length);
      const randomTalkingAnimation = talkingAnimations[randomIndex];

      setAdditiveActions({
        ...additiveActions,
        speak: { weight: 1 },
      });

      setCurrentBaseAction({
        action: randomTalkingAnimation,
        weight: 1,
      });
    } else if (!speaking && additiveActions.speak.weight !== 0) {
      // Otherwise, if not speaking, set to idle
      setAdditiveActions({
        ...additiveActions,
        speak: { weight: 0 },
      });
      setCurrentBaseAction({
        action: 'Idle',
        weight: 1,
      });
    }
  }, [speaking, loading]);

  return (
    <>
      {halfBody === false && (
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
  halfBody = true,
  loading,
  animation,
}: Props) {
  return (
    <Canvas
      style={
        style || (halfBody ? defaultStyles.halfBody : defaultStyles.fullBody)
      }
      camera={getCameraSettings(halfBody) as any}
    >
      {/* <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />} > */}
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
      />
      {/* </Suspense> */}
    </Canvas>
  );
}
