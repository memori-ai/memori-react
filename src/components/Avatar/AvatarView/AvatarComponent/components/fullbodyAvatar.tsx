import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  Vector3,
  Euler,
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  MathUtils,
  AnimationAction,
  LoopOnce,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, useFrame } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useAvatarBlink } from '../../utils/useEyeBlink';

interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  onLoaded?: () => void;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  timeScale: number;
  isZoomed?: boolean;
  eyeBlink?: boolean;
  stopProcessing: () => void;
  resetVisemeQueue: () => void;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
  smoothMorphTarget?: boolean;
  morphTargetSmoothing?: number;
  morphTargetInfluences: Record<string, number>;
  setMorphTargetDictionary: (
    morphTargetDictionary: Record<string, number>
  ) => void;
  setMorphTargetInfluences: (
    morphTargetInfluences: Record<string, number>
  ) => void;
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/1c350a21-97d8-4add-82cc-9dc10767a26b.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/c2b07166-de10-4c66-918b-7b7cd380cca7.glb',
};

export default function FullbodyAvatar({
  url,
  sex,
  onLoaded,
  currentBaseAction,
  timeScale,
  isZoomed,
  eyeBlink,
  stopProcessing,
  morphTargetSmoothing = 0.5,
  updateCurrentViseme,
  setMorphTargetDictionary,
  setMorphTargetInfluences,
  morphTargetInfluences,
  resetVisemeQueue,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);

  const mixer = useRef(new AnimationMixer(scene));
  const headMeshRef = useRef<SkinnedMesh>();
  const currentActionRef = useRef<AnimationAction | null>(null);
  const [isTransitioningToIdle, setIsTransitioningToIdle] = useState(false);

  useAvatarBlink({
    enabled: eyeBlink || false,
    setMorphTargetInfluences,
  });

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
      stopProcessing();
      resetVisemeQueue();
    };
  }, [materials, nodes, url, onLoaded, stopProcessing, scene]);

  // Handle base animation changes
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

    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(fadeOutDuration);
    }

    newAction.reset().fadeIn(fadeInDuration).play();
    currentActionRef.current = newAction;

    // Set the time scale for the new action
    newAction.timeScale = timeScale;

    // If it's an emotion animation, set it to play once and then transition to idle
    if (
      currentBaseAction.action.startsWith('Gioia') ||
      currentBaseAction.action.startsWith('Rabbia') ||
      currentBaseAction.action.startsWith('Sorpresa') ||
      currentBaseAction.action.startsWith('Timore') ||
      currentBaseAction.action.startsWith('Tristezza')
    ) {
      newAction.setLoop(LoopOnce, 1);
      newAction.clampWhenFinished = true;
      setIsTransitioningToIdle(true);
    }
  }, [actions, currentBaseAction, timeScale]);

  useFrame(state => {
    if (
      headMeshRef.current &&
      headMeshRef.current.morphTargetDictionary &&
      headMeshRef.current.morphTargetInfluences
    ) {
      const currentViseme = updateCurrentViseme(state.clock.getElapsedTime());

      // Reset all visemes
      Object.keys(headMeshRef.current.morphTargetDictionary).forEach(
        visemeName => {
          if (
            headMeshRef.current &&
            headMeshRef.current.morphTargetInfluences &&
            headMeshRef.current.morphTargetDictionary
          ) {
            const index = headMeshRef.current.morphTargetDictionary[visemeName];
            const currentValue =
              headMeshRef.current.morphTargetInfluences[index];
            headMeshRef.current.morphTargetInfluences[index] = MathUtils.lerp(
              currentValue,
              0,
              morphTargetSmoothing
            );
          }
        }
      );

      // Apply current viseme
      if (currentViseme) {
        const visemeIndex =
          headMeshRef.current.morphTargetDictionary[currentViseme.name];
        if (typeof visemeIndex === 'number') {
          const currentValue =
            headMeshRef.current.morphTargetInfluences[visemeIndex];
          const smoothValue = MathUtils.lerp(
            currentValue,
            currentViseme.weight * 1.55, // Amplify the effect
            morphTargetSmoothing
          );
          headMeshRef.current.morphTargetInfluences[visemeIndex] = smoothValue;
        }
      }
    }

    if (isTransitioningToIdle && currentActionRef.current) {
      if (
        currentActionRef.current.time >=
        currentActionRef.current.getClip().duration
      ) {
        // Transition to the idle animation, take the last character of the current animation
        const idleNumber = currentBaseAction.action.charAt(
          currentBaseAction.action.length - 1
        );
        const idleAction = actions[`Idle${idleNumber}`];

        if (idleAction) {
          currentActionRef.current.fadeOut(0.5);
          idleAction.reset().fadeIn(0.5).play();
          currentActionRef.current = idleAction;
          setIsTransitioningToIdle(false);
        }
      }
    }

    mixer.current.update(0.01); // Fixed delta time for consistent animation speed
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
