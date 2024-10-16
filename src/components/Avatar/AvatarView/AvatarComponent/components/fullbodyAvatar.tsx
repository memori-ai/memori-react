import React, { useEffect, useRef, useState } from 'react';
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
  emotionMorphTargets: Record<string, number>;
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/0e49aa5d-f757-4292-a170-d843c2839a41.glb',
};

// Blink configuration
const BLINK_CONFIG = {
  minInterval: 1000,
  maxInterval: 5000,
  blinkDuration: 150,
};

const EMOTION_TRANSITION_SPEED = 0.1; // Adjust this value to control emotion transition speed

export default function FullbodyAvatar({
  url,
  sex,
  onLoaded,
  currentBaseAction,
  timeScale,
  isZoomed,
  eyeBlink,
  morphTargetSmoothing = 0.5,
  updateCurrentViseme,
  setMorphTargetDictionary,
  setMorphTargetInfluences,
  emotionMorphTargets,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);

  const mixer = useRef(new AnimationMixer(scene));
  const headMeshRef = useRef<SkinnedMesh>();
  const currentActionRef = useRef<AnimationAction | null>(null);
  const [isTransitioningToIdle, setIsTransitioningToIdle] = useState(false);

  // Blink state
  const lastBlinkTime = useRef(0);
  const nextBlinkTime = useRef(0);
  const isBlinking = useRef(false);
  const blinkStartTime = useRef(0);

  // Morph targets
  const currentEmotionRef = useRef<Record<string, number>>({});
  const previousEmotionKeysRef = useRef<Set<string>>(new Set());

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

      // Create a set of current emotion keys
      const currentEmotionKeys = new Set(Object.keys(emotionMorphTargets));

      // Reset old emotion morph targets
      previousEmotionKeysRef.current.forEach(key => {
        if (!currentEmotionKeys.has(key)) {
          const index = headMeshRef.current!.morphTargetDictionary![key];
          if (typeof index === 'number') {
            currentEmotionRef.current[key] = 0;
            if (headMeshRef.current && headMeshRef.current.morphTargetInfluences) {
              headMeshRef.current.morphTargetInfluences[index] = 0;
            }
          }
        }
      });

      // Update morph targets
      Object.entries(headMeshRef.current.morphTargetDictionary).forEach(
        ([key, index]) => {
          if (typeof index === 'number') {
            let targetValue = 0;

            // Handle emotions (base layer)
            if (Object.prototype.hasOwnProperty.call(emotionMorphTargets, key)) {
              const targetEmotionValue = emotionMorphTargets[key];
              const currentEmotionValue = currentEmotionRef.current[key] || 0;
              const newEmotionValue = MathUtils.lerp(
                currentEmotionValue,
                targetEmotionValue * 2,
                EMOTION_TRANSITION_SPEED
              );
              currentEmotionRef.current[key] = newEmotionValue;
              targetValue += newEmotionValue;
            }

            // Handle visemes (additive layer)
            if (currentViseme && key === currentViseme.name) {
              targetValue += currentViseme.weight * 1.2; // Amplify the effect
            }

            // Handle blinking (additive layer, only for 'eyesClosed')
            if (key === 'eyesClosed' && eyeBlink) {
              targetValue += blinkValue;
            }

            // Clamp the final value between 0 and 1
            targetValue = MathUtils.clamp(targetValue, 0, 1);

            // Apply smoothing
            if (headMeshRef.current && headMeshRef.current.morphTargetInfluences) {
              headMeshRef.current.morphTargetInfluences[index] = MathUtils.lerp(
                headMeshRef.current.morphTargetInfluences[index],
                targetValue,
                morphTargetSmoothing
              );
            }
          }
        }
      );

      // Update the set of previous emotion keys for the next frame
      previousEmotionKeysRef.current = currentEmotionKeys;

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

      // Update the animation mixer
      mixer.current.update(0.01); // Fixed delta time for consistent animation speed
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