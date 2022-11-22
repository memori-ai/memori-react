import { CSSProperties } from 'react';
import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import Loader from './components/loader';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid } from '../../helpers/utils';

export interface Props {
  url: string;
  fallbackImg?: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  rotateAvatar?: boolean;
  speaking?: boolean;
  style?: CSSProperties;
  fallback?: React.ReactNode;
}

const defaultStyle = {
  width: '250px',
  height: '250px',
  backgroundColor: 'white',
  borderRadius: '100%',
};

export default function AvatarView({
  url,
  fallbackImg,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  speaking,
  fallback,
}: Props) {
  return (
    <Canvas
      style={style || defaultStyle}
      camera={{ fov: 40, position: [0, 0, 0.6] }}
    >
      <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />}>
        {isAndroid() ? (
          <SpotLight
            distance={100}
            position={[-0.3, 0.2, 1.25]}
            angle={Math.PI / 2}
            attenuation={5}
            anglePower={5}
          />
        ) : (
          <Environment preset="sunset" />
        )}
        {rotateAvatar && <OrbitControls enablePan={false} enableZoom={false} />}
        <Avatar
          url={url}
          eyeBlink={eyeBlink}
          headMovement={headMovement}
          speaking={speaking}
        />
      </Suspense>
    </Canvas>
  );
}
