import React, { useEffect, useRef, useMemo, useCallback } from 'react';
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
  emotionMorphTargets: Record<string, number>;
  isChatAlreadyStarted: boolean;
}

const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/8d1a5853-f05a-4a34-9f99-6eff64986081.glb',
};

const BLINK_CONFIG = {
  minInterval: 1000,
  maxInterval: 5000,
  blinkDuration: 150,
};

const EMOTION_SMOOTHING = 0.3;
const VISME_SMOOTHING = 0.5;

const TOTAL_IDLE_ANIMATIONS = 5;
const FADE_DURATION = 0.8;

export default function FullbodyAvatar({
  url,
  sex,
  currentBaseAction,
  timeScale,
  isZoomed,
  eyeBlink,
  updateCurrentViseme,
  setMorphTargetDictionary,
  setMorphTargetInfluences,
  emotionMorphTargets,
  isChatAlreadyStarted,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { actions } = useAnimations(animations, scene);

  const mixerRef = useRef<AnimationMixer>();
  const headMeshRef = useRef<SkinnedMesh>();
  const currentActionRef = useRef<AnimationAction | null>(null);
  const isTransitioningToIdleRef = useRef(false);

  const lastBlinkTimeRef = useRef(0);
  const nextBlinkTimeRef = useRef(0);
  const isBlinkingRef = useRef(false);
  const blinkStartTimeRef = useRef(0);

  const currentEmotionRef = useRef<Record<string, number>>({});
  const previousEmotionKeysRef = useRef<Set<string>>(new Set());

  // Memoize the scene traversal
  const headMesh = useMemo(() => {
    let foundMesh: SkinnedMesh | undefined;
    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar')
      ) {
        foundMesh = object;
      }
    });
    return foundMesh;
  }, [scene]);

  useEffect(() => {
    if (headMesh) {
      headMeshRef.current = headMesh;
      if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
        setMorphTargetDictionary(headMesh.morphTargetDictionary);
        const initialInfluences = Object.keys(
          headMesh.morphTargetDictionary
        ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        setMorphTargetInfluences(initialInfluences);
      }
    }
    mixerRef.current = new AnimationMixer(scene);
  }, [headMesh, scene, setMorphTargetDictionary, setMorphTargetInfluences]);

  // Memoize the animation change handler
  const handleAnimationChange = useCallback(() => {
    if (!actions || !currentBaseAction.action) return;

    const newAction = actions[currentBaseAction.action];
    if (!newAction) {
      console.warn(
        `Animation "${currentBaseAction.action}" not found in actions.`
      );
      return;
    }

    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(FADE_DURATION);
    }

    newAction.reset().fadeIn(FADE_DURATION).play();
    currentActionRef.current = newAction;
    newAction.timeScale = timeScale;

    if (!currentBaseAction.action.startsWith('Loading')) {
      newAction.setLoop(LoopOnce, 1);
      newAction.clampWhenFinished = true;
      isTransitioningToIdleRef.current = true;
    } else {
      isTransitioningToIdleRef.current = false;
    }
  }, [actions, currentBaseAction, timeScale]);

  useEffect(() => {
    handleAnimationChange();
  }, [handleAnimationChange]);

  // Optimize the frame update function
  const updateFrame = useCallback(
    (currentTime: number) => {
      if (
        !headMeshRef.current ||
        !headMeshRef.current.morphTargetDictionary ||
        !headMeshRef.current.morphTargetInfluences
      )
        return;

      let blinkValue = 0;
      if (eyeBlink) {
        if (currentTime >= nextBlinkTimeRef.current && !isBlinkingRef.current) {
          isBlinkingRef.current = true;
          blinkStartTimeRef.current = currentTime;
          lastBlinkTimeRef.current = currentTime;
          nextBlinkTimeRef.current =
            currentTime +
            Math.random() *
              (BLINK_CONFIG.maxInterval - BLINK_CONFIG.minInterval) +
            BLINK_CONFIG.minInterval;
        }

        if (isBlinkingRef.current) {
          const blinkProgress =
            (currentTime - blinkStartTimeRef.current) /
            BLINK_CONFIG.blinkDuration;
          if (blinkProgress <= 0.5) {
            blinkValue = blinkProgress * 2;
          } else if (blinkProgress <= 1) {
            blinkValue = 2 - blinkProgress * 2;
          } else {
            isBlinkingRef.current = false;
            blinkValue = 0;
          }
        }
      }

      // Update current viseme
      const currentViseme = updateCurrentViseme(currentTime / 1000);
      const currentEmotionKeys = new Set(Object.keys(emotionMorphTargets));

      // Update morph target influences
      Object.entries(headMeshRef.current.morphTargetDictionary).forEach(
        ([key, index]) => {
          if (typeof index === 'number') {
            let targetValue = 0;

            if (currentEmotionKeys.has(key)) {
              const targetEmotionValue = emotionMorphTargets[key];
              const currentEmotionValue = currentEmotionRef.current[key] || 0;
              const newEmotionValue = MathUtils.lerp(
                currentEmotionValue,
                targetEmotionValue * 2.5,
                EMOTION_SMOOTHING
              );
              currentEmotionRef.current[key] = newEmotionValue;
              targetValue += newEmotionValue;
            }

            if (currentViseme && key === currentViseme.name) {
              targetValue += currentViseme.weight;
            }

            if (key === 'eyesClosed' && eyeBlink) {
              targetValue += blinkValue;
            }

            targetValue = MathUtils.clamp(targetValue, 0, 1);
            if (
              headMeshRef.current &&
              headMeshRef.current.morphTargetInfluences
            ) {
              headMeshRef.current.morphTargetInfluences[index] = MathUtils.lerp(
                headMeshRef.current.morphTargetInfluences[index],
                targetValue,
                VISME_SMOOTHING
              );
            }
          }
        }
      );

      // Update previous emotion keys
      previousEmotionKeysRef.current = currentEmotionKeys;

      // Transition to idle
      if (isTransitioningToIdleRef.current && currentActionRef.current) {
        // Check if the current animation has finished playing,
        let animationDuration =
          currentActionRef.current.getClip().duration * 0.9;
        if (currentActionRef.current.time >= animationDuration) {
          // Generate random number between 1-5 for idle animation variation
          let idleNumber = Math.floor(Math.random() * 5) + 1;

          // If the current animation is already the last idle animation,
          // we need to skip it and go to the next one
          if (
            currentActionRef.current
              ?.getClip()
              .name.endsWith(idleNumber.toString())
          ) {
            idleNumber = idleNumber === 5 ? 4 : idleNumber + 1;
          }

          // If the chat has already started, we need to skip idle3 and go to idle4,
          // because idle3 is the animation in which the avatar turn around
          if (isChatAlreadyStarted && idleNumber === 3) {
            idleNumber = currentActionRef.current?.getClip().name.endsWith('4')
              ? 2
              : 4;
          }
          const idleAction = actions[`Idle${idleNumber}`];

          // console.log(
          //   'currentActionRef.current' +
          //     currentActionRef.current?.getClip().name +
          //     ' idle action ' +
          //     idleAction?.getClip().name +
          //     idleAction?.getClip().duration
          // );

          if (idleAction) {
            // Smoothly transition from current animation to new idle animation:
            // 1. Fade out current animation over 0.8 seconds
            currentActionRef.current.fadeOut(FADE_DURATION);
            // 2. Reset idle animation to start, fade it in over 0.8 seconds, and play it
            idleAction.reset().fadeIn(FADE_DURATION).play();
            // 3. Update the current animation reference to the new idle animation
            currentActionRef.current = idleAction;
            // Set the time scale of the new idle animation
            idleAction.timeScale = timeScale;
            // Reset the transitiontoIdle flag only
          }
        }
      }

      mixerRef.current?.update(0.01);
    },
    [actions, emotionMorphTargets, eyeBlink, updateCurrentViseme]
  );

  useFrame(state => {
    updateFrame(state.clock.elapsedTime * 1000);
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
