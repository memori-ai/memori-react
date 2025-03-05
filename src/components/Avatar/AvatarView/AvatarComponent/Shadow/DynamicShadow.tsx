import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { AvatarAnimator } from '../components/controllers/AvatarAnimator';

const DynamicShadow = ({
  animator,
  avatarPosition,
  }: {
    animator: AvatarAnimator | null;
  avatarPosition: any;
}) => {
  // Calculate shadow properties based on animation
  const getShadowProps = () => {
    const baseProps = {
      width: 10,
      height: 10,
      blur: 2.5,
      scale: 10,
      far: 5,
      resolution: 1024,
      color: '#000000',
    };

    if (!animator) {
      return {
        ...baseProps,
        opacity: 0,
      };
    }
    // Adjust shadow based on animation type
    if (animator.getCurrentAnimationName()?.startsWith('Loading')) {
      return {
        ...baseProps,
        opacity: 0.85,
        blur: 3,
        width: 12,
        height: 12,
      };
    } else if (
      animator.getCurrentAnimationName()?.includes('Gioia') ||
      animator.getCurrentAnimationName()?.includes('Joy')
    ) {
      return {
        ...baseProps,
        opacity: 0.9,
        blur: 2,
        width: 11,
        height: 11,
      };
    } else if (
      animator.getCurrentAnimationName()?.includes('Rabbia') ||
      animator.getCurrentAnimationName()?.includes('Anger')
    ) {
      return {
        ...baseProps,
        opacity: 0.95,
        blur: 1.8,
        width: 12,
        height: 12,
      };
    }

    // Default idle state
    return {
      ...baseProps,
      opacity: 0.9,
      blur: 2.2,
    };
  };

  const shadowProps = getShadowProps();

  return (
    <>
      {/* Main body shadow */}
      <ContactShadows
        opacity={shadowProps.opacity}
        scale={shadowProps.scale}
        blur={shadowProps.blur}
        far={shadowProps.far}
        resolution={shadowProps.resolution}
        color={shadowProps.color}
        frames={Infinity}
        position={[0, avatarPosition.y, 0]}
      />

      {/* Foot shadow - smaller and sharper */}
      <ContactShadows
         opacity={1}
         width={5}
         height={5}
         blur={1}
         far={2}
         resolution={1024}
         color="#000000"
        position={[0, -0.98, 0]}
      />
    </>
  );
};

export default DynamicShadow;
