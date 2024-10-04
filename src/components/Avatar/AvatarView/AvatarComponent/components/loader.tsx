import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import Spin from '../../../../ui/Spin';

interface Props {
  fallbackImg?: string;
}

const Loader = ({ fallbackImg }: Props) => {
  const { progress } = useProgress();
  return (
    <Html center className="avatar-loader">
      <Spin spinning>
        {fallbackImg ? (
          <figure>
            <img
              src={fallbackImg}
              alt={`${Math.round(progress)}% loaded`}
              title={`${Math.round(progress)}% loaded`}
            />
            <figcaption>{`${Math.round(progress)}%`}</figcaption>
          </figure>
        ) : (
          <>{Math.round(progress)} % loaded</>
        )}
      </Spin>
    </Html>
  );
};

export default Loader;
