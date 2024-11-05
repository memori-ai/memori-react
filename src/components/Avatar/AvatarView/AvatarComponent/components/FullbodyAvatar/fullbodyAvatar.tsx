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
import { useFrame } from '@react-three/fiber';
import { AnimationState, FullbodyAvatarProps } from './types';
import { AnimationController } from './AnimationController';
import { MorphTargetController } from './MorhTargetController';
import {
  AVATAR_POSITION,
  AVATAR_ROTATION,
  AVATAR_POSITION_ZOOMED,
  ANIMATION_URLS,
  DEFAULT_CONFIG,
} from './constants';

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
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { actions } = useAnimations(animations, scene);

  const animationControllerRef = useRef<AnimationController>();
  const morphTargetControllerRef = useRef<MorphTargetController>();
  const blinkStateRef = useRef({
    isBlinking: false,
    lastBlinkTime: 0,
    nextBlinkTime: 0,
    blinkStartTime: 0,
  });

  // Find head mesh
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

  // Initialize controllers
  useEffect(() => {
    if (!actions || !headMesh) return;

    const mixer = new AnimationMixer(scene);
    animationControllerRef.current = new AnimationController(
      mixer,
      actions as Record<string, AnimationAction>,
      { ...DEFAULT_CONFIG }
    );

    morphTargetControllerRef.current = new MorphTargetController(headMesh);

    // Initialize morph target dictionary and influences
    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      setMorphTargetDictionary(headMesh.morphTargetDictionary);
      const initialInfluences = Object.keys(
        headMesh.morphTargetDictionary
      ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
      setMorphTargetInfluences(initialInfluences);
    }
  }, [
    actions,
    headMesh,
    scene,
    setMorphTargetDictionary,
    setMorphTargetInfluences,
    timeScale,
  ]);

  // Handle animation state changes
  useEffect(() => {
    if (!animationControllerRef.current) return;

    if (currentBaseAction.action.startsWith('Loading')) {
      animationControllerRef.current.transitionTo(
        AnimationState.LOADING,
        currentBaseAction.action
      );
    } else if (currentBaseAction.action.startsWith('Idle')) {
      animationControllerRef.current.transitionTo(AnimationState.IDLE);
    } else {
      animationControllerRef.current.updateIsChatAlreadyStarted(true);
      animationControllerRef.current.transitionTo(
        AnimationState.EMOTION,
        currentBaseAction.action
      );
    }
  }, [currentBaseAction]);

  // Update timeScale when it changes
  useEffect(() => {
    animationControllerRef.current?.setTimeScale(timeScale);
  }, [timeScale]);

  // Animation update loop
  useFrame(state => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Update animations
    animationControllerRef.current?.update(state.clock.getDelta());

    // Update morph targets
    if (morphTargetControllerRef.current) {
      const currentViseme = updateCurrentViseme(currentTime / 1000);
      morphTargetControllerRef.current.updateMorphTargets(
        currentTime,
        emotionMorphTargets,
        currentViseme,
        eyeBlink || false,
        blinkStateRef.current
      );
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
