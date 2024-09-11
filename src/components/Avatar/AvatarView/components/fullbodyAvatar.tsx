import React, { useEffect, useMemo } from 'react';
import { Vector3, Euler } from 'three';
import { useAnimations, useGLTF} from '@react-three/drei';
import { useGraph, dispose } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../utils/utils';
import useEyeBlink from '../utils/useEyeBlink';
import useMouthSpeaking from '../utils/useMouthSpeaking';
import useLoadingMorphAnim from '../utils/useLoadingMorphAnim';
import useSmile from '../utils/useSmile';

export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  eyeBlink?: boolean;
  speaking?: boolean;
  onLoaded?: () => void;
  animation?:
    | 'Idle'
    | 'Idle 1'
    | 'Idle 2'
    | 'Idle 3'
    | 'Loading'
    | 'Sad'
    | 'Talk 1'
    | 'Talk 2'
    | 'Talk 3';
}

const AVATAR_POSITION = new Vector3(0, -0.6, -0.8);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);

const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/5de7456f-0cd8-4e29-95a7-0cd0045a5325.glb',
  FEMALE: 'https://assets.memori.ai/api/v2/asset/84487a2b-377c-4565-800a-51459d580ec8.glb'
};

export default function FullbodyAvatar({
  url,
  sex,
  eyeBlink,
  speaking,
  onLoaded,
  animation,
}: FullbodyAvatarProps) {


  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);
  
  
  useEyeBlink(eyeBlink, nodes);
  useMouthSpeaking(!!speaking, nodes);
  useLoadingMorphAnim(animation === 'Loading', nodes);
  useSmile(animation?.startsWith('Idle'), nodes);

  useEffect(() => {
    correctMaterials(materials);
    onLoaded?.();

    return () => {
      Object.values(materials).forEach(dispose);
      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);

  useEffect(() => {
    try {
      if (animation && animation in actions) {
        Object.entries(actions).forEach(([name, action]) => {
          if (!action) return;
          if (name === animation) {
            action.fadeIn(0.3).play();
          } else {
            action.fadeOut(0.3).stop();
          }
        });
      } else {
        Object.values(actions).forEach(action => {
          action?.fadeOut(0.2).reset().stop();
        });
      }
    } catch (e) {
      console.error('Error animating avatar:', e);
    }
  }, [animation, actions]);

  return (
    <group position={AVATAR_POSITION} rotation={AVATAR_ROTATION}>
      <primitive object={scene} />
    </group>
  );
}
