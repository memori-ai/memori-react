import { CSSProperties } from 'react';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';
import {AvatarView} from './AvatarComponent/avatarComponent';
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
  setMeshRef?: any;
  updateCurrentViseme: (currentTime: number) => { name: string; weight: number } | null;
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
  updateCurrentViseme,
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
          url={url}
          sex={sex}
          showControls={showControls}
          loading={loading || false}
          animation={animation}
          isZoomed={isZoomed || false}
          eyeBlink={eyeBlink || false}
          headMovement={headMovement || false}
          speaking={speaking || false}
          halfBody={halfBody || false}
          chatEmission={chatEmission}
          updateCurrentViseme={updateCurrentViseme}
        />
      </Suspense>
    </Canvas>
  );
}
