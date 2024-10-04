import React, { useEffect, useState } from 'react';
import {
  Vector3,
  Euler,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../utils/utils';
import useEyeBlink from '../utils/useEyeBlink';
import useMouthSpeaking from '../utils/useMouthSpeaking';
import useHeadMovement from '../utils/useHeadMovement';
import useSmile from '../utils/useSmile';

interface BaseAction {
  weight: number;
  action?: string;
}

export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  onLoaded?: () => void;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  additiveActions: {
    [key: string]: {
      weight: number;
    };
  };
  timeScale: number;
  loading?: boolean;
  speaking?: boolean;
  isZoomed?: boolean;
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);
const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/1c350a21-97d8-4add-82cc-9dc10767a26b.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/a1908dbf-8ce8-438d-90df-acf9dc2604ad.glb',
};

export default function FullbodyAvatar({
  url,
  sex,
  onLoaded,
  currentBaseAction,
  additiveActions,
  timeScale,
  isZoomed,
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
    if (!actions || !currentBaseAction.action) return;

    const newAction = actions[currentBaseAction.action];

    if (!newAction) {
      console.warn(
        `Animation "${currentBaseAction.action}" not found in actions.`
      );
      return;
    }

    const fadeOutDuration = 0.8;
    const fadeInDuration = 0.8;

    newAction.timeScale = timeScale;
    newAction.reset().fadeIn(fadeInDuration).play();

    return () => {
      newAction.fadeOut(fadeOutDuration);
    };
  }, [currentBaseAction, timeScale]);

  // Additive actions
  useEyeBlink(additiveActions.eyesClosed.weight > 0, nodes);
  useMouthSpeaking(additiveActions.Talk.weight > 0, nodes);
  // useHeadMovement(additiveActions.headMovement.weight > 0, nodes);
  useSmile(additiveActions.mouthSmile.weight > 0, nodes);

  useFrame((_, delta) => {
    mixer.update(delta * 0.001);
  });

  return (
    <group
      position={isZoomed ? AVATAR_POSITION_ZOOMED : AVATAR_POSITION}
      rotation={AVATAR_ROTATION}
    >
      <primitive object={scene} />
    </group>
  );
}
