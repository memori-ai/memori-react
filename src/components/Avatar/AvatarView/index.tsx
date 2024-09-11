import { CSSProperties } from 'react';
import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import FullbodyAvatar, { FullbodyAvatarProps } from './components/fullbodyAvatar';
import Loader from './components/loader';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight, Environment } from '@react-three/drei';
import { isAndroid, isiOS } from '../../../helpers/utils';

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
  animation?: FullbodyAvatarProps['animation'];
}

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
    ? { fov: 40, position: [0, 0, 0.6] }
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

const AvatarComponent = ({ halfBody, ...props }: Props & { halfBody: boolean }) =>
  halfBody ? (
    <Avatar {...props} />
  ) : (
    <FullbodyAvatar {...props} />
  );

export default function AvatarView({
  url,
  sex,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  speaking,
  halfBody = true,
  animation,
}: Props) {
  return (
    <Canvas
      style={style || (halfBody ? defaultStyles.halfBody : defaultStyles.fullBody)}
      camera={getCameraSettings(halfBody) as any}
    >
      {/* <Suspense fallback={fallback || <Loader fallbackImg={fallbackImg} />}> */}
        {getLightingComponent()}
        {rotateAvatar && halfBody && (
          <OrbitControls enablePan={false} enableZoom={false} />
        )}
        <AvatarComponent
          halfBody={halfBody}
          url={url}
          sex={sex}
          eyeBlink={eyeBlink}
          headMovement={headMovement}
          speaking={speaking}
          animation={animation}
        />
      {/* </Suspense> */}
    </Canvas>
  );
}
