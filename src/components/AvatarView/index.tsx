import { CSSProperties } from 'react';
import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import FullbodyAvatar, { AvatarProps } from './components/fullbodyAvatar';
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
  halfBody?: boolean;
  animation?: AvatarProps['animation'];
}

const defaultStylesHalfBody = {
  width: '250px',
  height: '250px',
  backgroundColor: 'white',
  borderRadius: '100%',
};

const defaultStylesFullBody = {
  width: '500px',
  height: '500px',
  backgroundColor: 'white',
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
  halfBody = true,
  animation,
}: Props) {
  const defaultStyles = halfBody
    ? defaultStylesHalfBody
    : defaultStylesFullBody;
  return (
    <Canvas
      style={style || defaultStyles}
      camera={
        halfBody
          ? {
              fov: 40,
              position: [0, 0, 0.6],
            }
          : { fov: 40, position: [0, 0.0000175, 3] }
      }
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
        {rotateAvatar && halfBody && (
          <OrbitControls enablePan={false} enableZoom={false} />
        )}
        {halfBody ? (
          <Avatar
            url={url}
            eyeBlink={eyeBlink}
            headMovement={headMovement}
            speaking={speaking}
          />
        ) : (
          <FullbodyAvatar
            url={url}
            eyeBlink={eyeBlink}
            headMovement={headMovement}
            speaking={speaking}
            animation={animation}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
