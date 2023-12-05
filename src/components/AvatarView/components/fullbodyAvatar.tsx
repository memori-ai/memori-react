import React, { memo, useEffect, useMemo } from 'react';
import {
  AnimationMixer,
  Object3D,
  Vector3,
  Euler,
  AnimationActionLoopStyles,
  SkinnedMesh,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import useEyeBlink from '../utils/useEyeBlink';
import useLoadingMorphAnim from '../utils/useLoadingMorphAnim';
import useMouthSpeaking from '../utils/useMouthSpeaking';
import { dispose, useGraph } from '@react-three/fiber';
import { correctMaterials, hideHands, isSkinnedMesh } from '../utils/utils';
import useSmile from '../utils/useSmile';

export interface AvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  eyeBlink?: boolean;
  headMovement?: boolean;
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

const position = new Vector3(0, -1, 0);
const rotation = new Euler(0.175, 0, 0);

export default function Avatar({
  url,
  sex,
  eyeBlink,
  speaking,
  onLoaded,
  animation,
}: AvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(
    sex === 'MALE'
      ? 'https://assets.memori.ai/api/v2/asset/5de7456f-0cd8-4e29-95a7-0cd0045a5325.glb'
      : 'https://assets.memori.ai/api/v2/asset/84487a2b-377c-4565-800a-51459d580ec8.glb'
  );
  // const { animations: loadingAnimations } = useGLTF(
  //   sex === 'MALE'
  //     ? 'https://assets.memori.ai/api/v2/asset/2150d3d3-b77d-4489-8455-e6239334e8a7.glb'
  //     : 'https://assets.memori.ai/api/v2/asset/0a04e5b2-1a02-4964-9534-75c2a7574660.glb'
  // );
  const { animations: loadingAnimations } = useGLTF(
    'https://assets.memori.ai/api/v2/asset/ebb61fe1-6b0d-4b11-a032-292b7ef307a4.glb'
  );
  const { nodes, materials } = useGraph(scene);

  const anim = useAnimations(animations, scene);
  const loadingAnim = useAnimations(
    loadingAnimations.filter(a => a.name === 'Loading'),
    scene
  );

  useEyeBlink(eyeBlink, nodes);
  // useHeadMovement(headMovement, nodes);
  useMouthSpeaking(!!speaking, nodes);
  useLoadingMorphAnim(animation === 'Loading', nodes);
  useSmile(animation?.startsWith('Idle'), nodes);

  useEffect(() => {
    correctMaterials(materials);

    if (onLoaded) onLoaded();

    return () => {
      Object.values(materials).forEach(dispose);

      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);

  try {
    if (animation && animation in anim.actions) {
      Object.keys(anim.actions).forEach(name => {
        let action = anim.actions[name];
        if (!action) return;
        else if (name === animation && animation !== 'Loading')
          action.fadeIn(0.3).play();
        else action.fadeOut(0.3).stop();
      });
      // if (animation === 'Loading') {
      //   loadingAnim.actions['Loading']?.fadeIn(0.3).play();
      // } else {
      //   loadingAnim.actions['Loading']?.fadeOut(0.3).stop();
      // }
    } else {
      Object.values(anim.actions).forEach(action => {
        if (!action) return;
        action?.fadeOut(0.2).reset().stop();
      });
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <group position={position} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}
