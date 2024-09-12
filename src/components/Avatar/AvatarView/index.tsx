import { CSSProperties, useRef } from 'react';
import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import FullbodyAvatar, {
  FullbodyAvatarProps
} from './components/fullbodyAvatar';
import Loader from './components/loader';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';
import { useThree } from '@react-three/fiber';
import { useState, useEffect, useCallback } from 'react';
import { GUI } from 'lil-gui';
import AnimationControlPanel from './components/controls';

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
  //animation?: FullbodyAvatarProps['animation'];
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

const additiveActions: Record<string, AdditiveAction> = {
  smile: { weight: 0 },
  blink: { weight: 0 },
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

const getCameraSettings = (halfBody: boolean) =>
  halfBody
    ? { fov: 40, position: [0, -0.1, 0.5] }
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
  halfBody,
  ...props
}: Props & { halfBody: boolean, currentBaseAction: {
  action: string;
  weight: number;
  oldAction: string;
} }) =>
  halfBody ? <Avatar {...props} /> : <FullbodyAvatar {...props} />;

const AvatarView = ({
  url,
  sex,
  eyeBlink,
  headMovement,
  speaking,
  // animation,
  halfBody,
}: Props & { halfBody: boolean }) => {
  const [currentBaseAction, setCurrentBaseAction] = useState({
    action: 'Idle',
    weight: 1,
    oldAction: 'Idle',
  });

  const [additiveActions, setAdditiveActions] = useState({
    smile: { weight: 0 },
    blink: { weight: 0 },
  });

  function onBaseActionChange(action: string, oldAction: string) {
    setCurrentBaseAction({
      action,
      weight: 1,
      oldAction,
    });
  }

  function onAdditiveActionChange(action: string, weight: number) {
    setAdditiveActions({
      ...additiveActions,
      [action]: { weight },
    });
  }


  return (
    <>
      {!halfBody && (
        <AnimationControlPanel
          onBaseActionChange={onBaseActionChange}
          baseActions={baseActions}
          additiveActions={additiveActions}
          currentBaseAction={currentBaseAction}
        />
      )}
      <AvatarComponent
        halfBody={halfBody}
        url={url}
        sex={sex}
        eyeBlink={eyeBlink}
        headMovement={headMovement}
        speaking={speaking}
        // animation={animation}
        currentBaseAction={currentBaseAction}
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
  // animation,
}: // fallback,
// fallbackImg,
Props) {
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
        // animation={animation}
      />
      {/* </Suspense> */}
    </Canvas>
  );
}
