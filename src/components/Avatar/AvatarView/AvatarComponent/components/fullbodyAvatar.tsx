import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Vector3,
  Euler,
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  AnimationAction,
  LoopOnce,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, useFrame } from '@react-three/fiber';
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
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/0e49aa5d-f757-4292-a170-d843c2839a41.glb',
};

const TRANSITION_DURATION = 0.5; // Duration for transitioning between animations

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
 //clearVisemes,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);
  const [mixer] = useState(() => new AnimationMixer(scene));

  const avatarMeshRef = useRef<SkinnedMesh>();
  const currentActionRef = useRef<AnimationAction | null>(null);
  const isTransitioningRef = useRef(false);
  const lastActionTimeRef = useRef(0);
  const [isTransitioningToIdle, setIsTransitioningToIdle] = useState(false);
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
        const remainingTime =
          (currentActionRef.current.getClip().duration -
            currentActionRef.current.time) *
          1000;
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
      if (currentActionRef.current && idleAction) {
        currentActionRef.current.crossFadeTo(
          idleAction,
          TRANSITION_DURATION,
          true
        );
      }

      if (idleAction) {
        idleAction.reset().fadeIn(TRANSITION_DURATION).play();
        currentActionRef.current = idleAction;
      }

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION * 1000);
    };

    if (
      currentActionRef.current &&
      !currentActionRef.current.getClip().name.startsWith('Idle')
    ) {
      finishCurrentAnimation();
    } else {
      startIdleAnimation();
    }
  }, [actions]);

  // Base animation
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
    
    console.log(newAction);
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

  // Set up the mesh reference and morph target influences
  useEffect(() => {
    correctMaterials(materials);

    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar')
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
      Object.values(materials).forEach(material => material.dispose());
      Object.values(nodes)
        .filter(isSkinnedMesh)
        .forEach(mesh => mesh.geometry.dispose());
      mixer.stopAllAction();
    };
  }, [
    materials,
    nodes,
    url,
    onLoaded,
    setMorphTargetDictionary,
    setMorphTargetInfluences,
    setMeshRef,
    mixer,
  ]);

  // Update morph target influences
  useFrame((_, delta) => {
    if (avatarMeshRef.current && avatarMeshRef.current.morphTargetDictionary) {
      updateMorphTargetInfluences();
    }
    mixer.update(delta);

    function updateMorphTargetInfluences() {
      Object.entries(morphTargetInfluences).forEach(([key, value]) => {
        const index = avatarMeshRef.current!.morphTargetDictionary![key];
        if (
          typeof index === 'number' &&
          avatarMeshRef.current!.morphTargetInfluences
        ) {
          const currentValue =
            avatarMeshRef.current!.morphTargetInfluences[index];
          const smoothValue = lerp(currentValue, value, 0.1);
          avatarMeshRef.current!.morphTargetInfluences[index] = smoothValue;
        }
      });
    }

    // Handle transition from emotion animation to idle
    if (isTransitioningToIdle && currentActionRef.current) {
      if (
        currentActionRef.current.time >=
        currentActionRef.current.getClip().duration
      ) {
        // Transition to the idle animation
        const idleNumber = Math.floor(Math.random() * 5) + 1; // Randomly choose 1, 2, 3, 4 or 5
        const idleAction = actions[`Idle${idleNumber == 3 ? 4 : idleNumber}`];

        if (idleAction) {
          currentActionRef.current.fadeOut(0.5);
          idleAction.reset().fadeIn(0.5).play();
          currentActionRef.current = idleAction;
          setIsTransitioningToIdle(false);
        }
      }
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
