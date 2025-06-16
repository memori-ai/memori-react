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
import Lights from './AvatarComponent/lights/Lights';

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
  // animation,
  showControls = false,
  isZoomed,
  chatEmission,
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
      <Canvas 
        style={style || defaultStyles.fullBody}
        shadows={true}
        dpr={[1, 2]} // Optimize pixel ratio
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, cameraZ]}
          fov={getCameraSettings(halfBody, isZoomed || false).fov}
          near={0.1}
          far={1000}
        />

        {rotateAvatar && (
          <OrbitControls
            enablePan={false} 
            enableZoom={false}
            target={[0, 0, 0]}
            enableDamping
            dampingFactor={0.05}
          />
        )}

        <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />}>
          <Lights />
          
          <AvatarView
            url={url}
            sex={sex}
            showControls={showControls}
            loading={loading || false}
            eyeBlink={eyeBlink || false}
            headMovement={headMovement || false}
            speaking={speaking || false}
            halfBody={halfBody}
            chatEmission={chatEmission}
            updateCurrentViseme={updateCurrentViseme}
            setCameraZ={setCameraZ}
            avatarHeight={avatarHeight}
            avatarDepth={avatarDepth}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
