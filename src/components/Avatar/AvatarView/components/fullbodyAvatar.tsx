import React, { useEffect, useState } from 'react';
import { Vector3, Euler, AnimationMixer, AnimationAction } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../utils/utils';

export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  onLoaded?: () => void;
  currentBaseAction: {
    action: string;
    weight: number;
    oldAction: string;
  };
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
  onLoaded,
  currentBaseAction,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);
  const [mixer] = useState(() => new AnimationMixer(scene));


  useEffect(() => {
    correctMaterials(materials);
    onLoaded?.();

    return () => {
      Object.values(materials).forEach(dispose);
      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);

  useEffect(() => {



    console.log('mixer', mixer);
    if (!actions || !currentBaseAction.action) return;

    const newAction = actions[currentBaseAction.action];
    const oldAction = actions[currentBaseAction.oldAction];

    if (!newAction) {
      console.warn(`Animation "${currentBaseAction.action}" not found in actions.`);
      return;
    }

    const fadeOutDuration = 0.8;
    const fadeInDuration = 0.8;
    const crossFadeDuration = 0.6;

    // Note: crossfades are possible with blend weights being set to (1,0,0), (0,1,0) or (0,0,1)
    if (oldAction && oldAction !== newAction) {
      oldAction.reset();
      oldAction.setEffectiveTimeScale(1);
      oldAction.crossFadeTo(newAction, crossFadeDuration, true);
      newAction.setEffectiveTimeScale(1);
      newAction.play();
    } else {
      newAction.reset().fadeIn(fadeInDuration).play();
    }

    return () => {
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [currentBaseAction, actions]);

  useFrame((_, delta) => {
    mixer.update(delta * 0.001);
  });

  return (
    <group position={AVATAR_POSITION} rotation={AVATAR_ROTATION}>
      <primitive object={scene} />
    </group>
  );
}