import React, { memo, useEffect, useMemo } from 'react';
import { AnimationMixer, Object3D, Vector3, Euler } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import useEyeBlink from '../utils/useEyeBlink';
import useHeadMovement from '../utils/useHeadMovement';
import useMouthSpeaking from '../utils/useMouthSpeaking';
import { dispose, useGraph } from '@react-three/fiber';
import { correctMaterials, hideHands, isSkinnedMesh } from '../utils/utils';

export interface AvatarProps {
  url: string;
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
  eyeBlink,
  headMovement,
  speaking,
  onLoaded,
  animation,
}: AvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(
    'https://assets.memori.ai/api/v2/asset/b11eef07-c45b-4959-9d43-be8105365c1f.glb'
  );
  const { nodes, materials } = useGraph(scene);

  const anim = useAnimations(animations, scene);

  useEyeBlink(eyeBlink, nodes);
  useHeadMovement(headMovement, nodes);
  useMouthSpeaking(!!speaking, nodes);

  useEffect(() => {
    correctMaterials(materials);

    if (onLoaded) onLoaded();

    return () => {
      Object.values(materials).forEach(dispose);

      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);

  // useEffect(() => {
  // console.log('animation', animation, animation && animation in anim.actions);
  try {
    if (animation && animation in anim.actions) {
      Object.keys(anim.actions).forEach(name => {
        let action = anim.actions[name];
        if (!action) return;
        else if (name === animation) action.play();
        else action.stop();
      });
    } else {
      Object.values(anim.actions).forEach(action => {
        if (!action) return;
        action?.reset().stop();
      });
    }
  } catch (e) {
    console.log(e);
  }
  // }, [animation]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}
