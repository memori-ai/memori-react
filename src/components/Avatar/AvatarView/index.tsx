import { CSSProperties, useState } from 'react';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  SpotLight,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';
import { AvatarView } from './AvatarComponent/avatarComponent';
import PositionControls from './AvatarComponent/positionControls/positionControls';
import { getLocalConfig } from '../../../helpers/configuration';
import Loader from './AvatarComponent/components/loader';

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
  chatEmission?: any;
  enablePositionControls?: boolean;
  setEnablePositionControls: (value: boolean) => void;
  isTotem?: boolean;
  setMeshRef?: any;
  stopProcessing: () => void;
  resetVisemeQueue: () => void;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
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

const getCameraSettings = (halfBody: boolean, isZoomed: boolean) => {
  const baseZ = halfBody ? 0.6 : 3;

  return {
    fov: isZoomed ? 44 : 40,
    position: [0, 0, baseZ],
    target: [0, 0, 0],
  };
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
  showControls = false,
  isZoomed,
  chatEmission,
  stopProcessing,
  resetVisemeQueue,
  updateCurrentViseme,
  enablePositionControls,
  setEnablePositionControls,
  isTotem = false,

}: Props) {
  const [cameraZ, setCameraZ] = useState(
    () => getCameraSettings(halfBody, isZoomed || false).position[2]
  );

  const getAvatarHeight = () => {
    // For totem avatars, use stored config value or default to 50
    if (isTotem) {
      const height = getLocalConfig('avatarHeight', 50);
      return height;
    }

    // For half body avatars, use fixed height of 100
    if (halfBody) {
      return 80;
    }

    // For full body avatars, adjust height based on zoom
    return isZoomed ? 16 : 65;
  };

  const getAvatarDepth = () => {
    // For totem avatars, use stored config value or default to 50
    if (isTotem) {
      const depth = getLocalConfig('avatarDepth', 50);
      return depth;
    }

    // For half body avatars, use fixed depth of 50
    if (halfBody) {
      return 50;
    }

    // For full body avatars, adjust depth based on zoom
    return isZoomed ? 5 : 100;
  };

  const [avatarHeight, setAvatarHeight] = useState(getAvatarHeight());
  const [avatarDepth, setAvatarDepth] = useState(getAvatarDepth());

  return (
    <>
          {enablePositionControls && (
        <PositionControls
          avatarHeight={avatarHeight}
          avatarDepth={avatarDepth}
          halfBody={halfBody}
          setAvatarHeight={setAvatarHeight}
          setAvatarDepth={setAvatarDepth}
          setEnablePositionControls={setEnablePositionControls}
        />
      )}
      <Canvas style={style || defaultStyles.fullBody}>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, cameraZ]}
          fov={getCameraSettings(halfBody, isZoomed || false).fov}
        />

        {rotateAvatar && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            target={[0, 0, 0]}
          />
        )}

        <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />}>
          {getLightingComponent()}

          <AvatarView
            url={url}
            sex={sex}
            showControls={showControls}
            loading={loading || false}
            animation={animation}
            isZoomed={isZoomed || false}
            eyeBlink={eyeBlink || false}
            headMovement={headMovement || false}
            speaking={speaking || false}
            halfBody={halfBody}
            chatEmission={chatEmission}
            updateCurrentViseme={updateCurrentViseme}
            stopProcessing={stopProcessing}
            resetVisemeQueue={resetVisemeQueue}
            setCameraZ={setCameraZ}
            avatarHeight={avatarHeight}
            avatarDepth={avatarDepth}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
