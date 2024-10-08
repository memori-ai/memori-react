import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Vector3,
  Euler,
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  AnimationAction,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useAvatarBlink } from '../../utils/useEyeBlink';
import { useViseme } from '../../../../../context/visemeContext';

const lerp = (start: number, end: number, alpha: number): number => {
  return start * (1 - alpha) + end * alpha;
};

interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  onLoaded?: () => void;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  timeScale: number;
  loading?: boolean;
  speaking?: boolean;
  isZoomed?: boolean;
  setMorphTargetInfluences: (influences: { [key: string]: number }) => void;
  setMorphTargetDictionary: (dictionary: { [key: string]: number }) => void;
  morphTargetInfluences: { [key: string]: number };
  morphTargetDictionary: { [key: string]: number };
  setMeshRef: any;
  eyeBlink?: boolean;
  clearVisemes: () => void;
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/1c350a21-97d8-4add-82cc-9dc10767a26b.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/c2b07166-de10-4c66-918b-7b7cd380cca7.glb',
};
const ANIMATION_DURATION = 3000; // Duration in milliseconds for non-idle animations

export default function FullbodyAvatar({
  url,
  sex,
  onLoaded,
  currentBaseAction,
  timeScale,
  isZoomed,
  setMorphTargetInfluences,
  setMorphTargetDictionary,
  morphTargetInfluences,
  eyeBlink,
  setMeshRef,
  clearVisemes,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);
  const [mixer] = useState(() => new AnimationMixer(scene));

  const avatarMeshRef = useRef<SkinnedMesh>();
  const currentActionRef = useRef<AnimationAction | null>(null);
  const isTransitioningRef = useRef(false);
   
  // Blink animation
  useAvatarBlink({
    enabled: eyeBlink || false,
    setMorphTargetInfluences,
    config: {
      minInterval: 1500,
      maxInterval: 4000,
      blinkDuration: 120,
    },
  });

  // Idle animation when emotion animation is finished
  const transitionToIdle = useCallback(() => {
    if (!actions || isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    const finishCurrentAnimation = () => {
      if (currentActionRef.current && !currentActionRef.current.paused) {
        const remainingTime = (currentActionRef.current.getClip().duration - currentActionRef.current.time) * 1000;
        setTimeout(() => {
          startIdleAnimation();
        }, remainingTime);
      } else {
        startIdleAnimation();
      }
    };

    const startIdleAnimation = () => {
      const idleAnimations = Object.keys(actions).filter(key =>
        key.startsWith('Idle')
      );
      const randomIdle =
        idleAnimations[Math.floor(Math.random() * idleAnimations.length)];

      const idleAction = actions[randomIdle];
      const fadeOutDuration = 0.5;
      const fadeInDuration = 0.5;

      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(fadeOutDuration);
      }

      idleAction?.reset().fadeIn(fadeInDuration).play();
      currentActionRef.current = idleAction;

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, (fadeOutDuration + fadeInDuration) * 1000);
    };

    if (currentActionRef.current && !currentActionRef.current.getClip().name.startsWith('Idle')) {
      finishCurrentAnimation();
    } else {
      startIdleAnimation();
    }
  }, [actions]);

  // Base animation
  useEffect(() => {
    if (!actions || !currentBaseAction.action || isTransitioningRef.current)
      return;

    const newAction = actions[currentBaseAction.action];
    if (!newAction) {
      console.warn(
        `Animation "${currentBaseAction.action}" not found in actions.`
      );
      return;
    }

    const fadeOutDuration = 0.8;
    const fadeInDuration = 0.8;

    if (!currentBaseAction.action.startsWith('Idle')) {
      setTimeout(() => {
        transitionToIdle();
      }, ANIMATION_DURATION);
    }

    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(fadeOutDuration);
    }

    newAction.timeScale = timeScale;
    newAction.reset().fadeIn(fadeInDuration).play();
    currentActionRef.current = newAction;
  }, [currentBaseAction, timeScale, actions, transitionToIdle]);

  // Set up the mesh reference and morph target influences
  useEffect(() => {
    correctMaterials(materials);

    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'Wolf3D_Avatar020' || object.name === 'Wolf3D_Avatar')
      ) {
        avatarMeshRef.current = object;
        setMeshRef(object);

        if (object.morphTargetDictionary && object.morphTargetInfluences) {
          setMorphTargetDictionary(object.morphTargetDictionary);

          const initialInfluences = Object.keys(
            object.morphTargetDictionary
          ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
          setMorphTargetInfluences(initialInfluences);
        }
      }
    });

    onLoaded?.();

    return () => {
      Object.values(materials).forEach(dispose);
      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
      clearVisemes();
    };
  }, [
    materials,
    nodes,
    url,
    onLoaded,
    setMorphTargetDictionary,
    setMorphTargetInfluences,
    setMeshRef,
    clearVisemes,
  ]);

  // Update morph target influences
  useFrame((_, delta) => {
    if (avatarMeshRef.current && avatarMeshRef.current.morphTargetDictionary) {
      updateMorphTargetInfluences();
    }
    mixer.update(delta * 0.001);

    function updateMorphTargetInfluences() {
      Object.entries(morphTargetInfluences).forEach(([key, value]) => {
        const index = avatarMeshRef.current!.morphTargetDictionary![key];
        if (typeof index === 'number' &&
          avatarMeshRef.current!.morphTargetInfluences) {
          const currentValue = avatarMeshRef.current!.morphTargetInfluences[index];
          const smoothValue = lerp(currentValue, value, 0.1);
          avatarMeshRef.current!.morphTargetInfluences[index] = smoothValue;
        }
      });
    }
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