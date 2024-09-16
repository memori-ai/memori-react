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
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/5de7456f-0cd8-4e29-95a7-0cd0045a5325.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/84487a2b-377c-4565-800a-51459d580ec8.glb',
};

export default function FullbodyAvatar({
  url,
  sex,
  onLoaded,
  currentBaseAction,
  additiveActions,
  timeScale
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




  // useEffect(() => {
  //   if (speaking && actions['Talk 1'] && actions['Talk 2']) {
  //     const talk1 = actions['Talk 1'].getClip();
  //     const talk2 = actions['Talk 2'].getClip();
  //     const talk = new AnimationClip(
  //       'Talk',
  //       talk1.duration + talk2.duration,
  //     );
  //     mixer.clipAction(talk, scene).play();
  //   }
  // }, [speaking]);

  // Additive actions
  useEyeBlink(additiveActions.blink.weight > 0, nodes);
  useMouthSpeaking(additiveActions.speak.weight > 0, nodes);
  useHeadMovement(additiveActions.headMovement.weight > 0, nodes);
  useSmile(additiveActions.smile.weight > 0, nodes);

  useFrame((_, delta) => {
    mixer.update(delta * 0.001);
  });

  return (
    <group position={AVATAR_POSITION} rotation={AVATAR_ROTATION}>
      <primitive object={scene} />
    </group>
  );
}
