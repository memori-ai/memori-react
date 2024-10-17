import React, { useEffect, useMemo, useRef } from 'react';
import { Object3D, SkinnedMesh, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { useAvatarBlink } from '../../utils/useEyeBlink';
import useHeadMovement from '../../utils/useHeadMovement';
import { hideHands } from '../../utils/utils';
import { AnimationMixer, MathUtils } from 'three';

interface HalfBodyAvatarProps {
  url: string;
  setMorphTargetInfluences: (morphTargetInfluences: any) => void;
  headMovement?: boolean;
  speaking?: boolean;
  onLoaded?: () => void;
  setMorphTargetDictionary: (morphTargetDictionary: any) => void;
  eyeBlink?: boolean;
  morphTargetInfluences: any;
  updateCurrentViseme: (currentTime: number) => any;
  morphTargetSmoothing?: number;
}

const AVATAR_POSITION = new Vector3(0, -0.6, 0);
// Blink configuration
const BLINK_CONFIG = {
  minInterval: 1000,
  maxInterval: 5000,
  blinkDuration: 150,
};

export default function HalfBodyAvatar({
  url,
  setMorphTargetInfluences,
  setMorphTargetDictionary,
  eyeBlink,
  onLoaded,
  morphTargetSmoothing = 0.5,
  updateCurrentViseme,
}: HalfBodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);
  const mixer = useRef(new AnimationMixer(scene));
  const avatarMeshRef = useRef<SkinnedMesh | null>(null);

  // Blink state
  const lastBlinkTime = useRef(0);
  const nextBlinkTime = useRef(0);
  const isBlinking = useRef(false);
  const blinkStartTime = useRef(0);

  const headMeshRef = useRef<SkinnedMesh>();

  useEffect(() => {
    correctMaterials(materials);

    scene.traverse((object: Object3D) => {
      if (object instanceof SkinnedMesh) {
        if (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar') {
          headMeshRef.current = object;
          if (object.morphTargetDictionary && object.morphTargetInfluences) {
            setMorphTargetDictionary(object.morphTargetDictionary);

            const initialInfluences = Object.keys(
              object.morphTargetDictionary
            ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
            setMorphTargetInfluences(initialInfluences);
          }
        }
      }
    });

    onLoaded?.();

    return () => {
      Object.values(materials).forEach(material => material.dispose());
      Object.values(nodes)
        .filter(isSkinnedMesh)
        .forEach(mesh => mesh.geometry.dispose());
    };
  }, [materials, nodes, url, onLoaded, scene]);
  useFrame(state => {

    if (
      headMeshRef.current &&
      headMeshRef.current.morphTargetDictionary &&
      headMeshRef.current.morphTargetInfluences
    ) {
      const currentTime = state.clock.getElapsedTime() * 1000; // Convert to milliseconds

      // Handle blinking
      let blinkValue = 0;
      if (eyeBlink) {
        if (currentTime >= nextBlinkTime.current && !isBlinking.current) {
          isBlinking.current = true;
          blinkStartTime.current = currentTime;
          lastBlinkTime.current = currentTime;
          nextBlinkTime.current =
            currentTime +
            Math.random() *
              (BLINK_CONFIG.maxInterval - BLINK_CONFIG.minInterval) +
            BLINK_CONFIG.minInterval;
        }

        if (isBlinking.current) {
          const blinkProgress =
            (currentTime - blinkStartTime.current) / BLINK_CONFIG.blinkDuration;
          if (blinkProgress <= 0.5) {
            // Eyes closing
            blinkValue = blinkProgress * 2;
          } else if (blinkProgress <= 1) {
            // Eyes opening
            blinkValue = 2 - blinkProgress * 2;
          } else {
            // Blink finished
            isBlinking.current = false;
            blinkValue = 0;
          }
        }
      }

      const currentViseme = updateCurrentViseme(currentTime / 1000);

      // Update morph targets
      Object.entries(headMeshRef.current.morphTargetDictionary).forEach(
        ([key, index]) => {
          if (typeof index === 'number') {
            let targetValue = 0;

            // Handle visemes (additive layer)
            if (currentViseme && key === currentViseme.name) {
              targetValue += currentViseme.weight * 1.3; // Amplify the effect
            }

            // Handle blinking (additive layer, only for 'eyesClosed')
            if (key === 'eyesClosed' && eyeBlink) {
              targetValue += blinkValue;
            }

            // Clamp the final value between 0 and 1
            targetValue = MathUtils.clamp(targetValue, 0, 1);

            // Apply smoothing
            if (
              headMeshRef.current &&
              headMeshRef.current.morphTargetInfluences
            ) {
              headMeshRef.current.morphTargetInfluences[index] = MathUtils.lerp(
                headMeshRef.current.morphTargetInfluences[index],
                targetValue,
                morphTargetSmoothing
              );
            }
          }
        }
      );

      // Update the animation mixer
      mixer.current.update(0.01); // Fixed delta time for consistent animation speed
    }
  });

  return (
    <group position={AVATAR_POSITION}>
      <primitive object={scene} />
    </group>
  );
}
