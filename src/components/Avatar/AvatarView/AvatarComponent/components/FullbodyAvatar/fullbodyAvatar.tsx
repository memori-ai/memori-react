import { useEffect, useRef, useMemo } from 'react';
import {
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  AnimationAction,
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { AnimationState, FullbodyAvatarProps } from './types';
import { AnimationController } from './AnimationController';
import { MorphTargetController } from '../MorphTargetController';
import { AvatarPositionController } from '../PositionController';
import {
  AVATAR_POSITION,
  AVATAR_ROTATION,
  AVATAR_POSITION_ZOOMED,
  ANIMATION_URLS,
  DEFAULT_CONFIG,
  SCALE_LERP_FACTOR,
} from '../constants';

export function FullbodyAvatar({
  url,
  sex,
  currentBaseAction,
  timeScale,
  eyeBlink,
  updateCurrentViseme,
  setMorphTargetDictionary,
  setMorphTargetInfluences,
  emotionMorphTargets,
  avatarHeight = 50,
  avatarDepth = 0,
  onCameraZChange,
}: FullbodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { actions } = useAnimations(animations, scene);

  const animationControllerRef = useRef<AnimationController>();
  const morphTargetControllerRef = useRef<MorphTargetController>();
  const positionControllerRef = useRef<AvatarPositionController>();
  
  const blinkStateRef = useRef({
    isBlinking: false,
    lastBlinkTime: 0,
    nextBlinkTime: 0,
    blinkStartTime: 0,
  });

  // Initialize controllers
  useEffect(() => {
    if (!positionControllerRef.current) {
      positionControllerRef.current = new AvatarPositionController(AVATAR_POSITION);
    }

    if (!actions || !scene) return;

    const mixer = new AnimationMixer(scene);
    animationControllerRef.current = new AnimationController(
      mixer,
      actions as Record<string, AnimationAction>,
      { ...DEFAULT_CONFIG }
    );

    if (headMesh) {
      morphTargetControllerRef.current = new MorphTargetController(headMesh);

      if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
        setMorphTargetDictionary(headMesh.morphTargetDictionary);
        const initialInfluences = Object.keys(headMesh.morphTargetDictionary)
          .reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        setMorphTargetInfluences(initialInfluences);
      }
    }
  }, [actions, scene]);
  useEffect(() => {
    if (positionControllerRef.current) {
      positionControllerRef.current.updateHeight(avatarHeight, false);
    }
  }, [avatarHeight]);

  useEffect(() => {
    if (positionControllerRef.current && onCameraZChange) {
      const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, false);
      onCameraZChange(newCameraZ);
    }
  }, [avatarDepth, onCameraZChange]);

  // Find head mesh
  const headMesh = useMemo(() => {
    let foundMesh: SkinnedMesh | undefined;
    scene?.traverse((object: Object3D) => {
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
      animationControllerRef.current.updateIsChatAlreadyStarted(true);
      animationControllerRef.current.transitionTo(
        AnimationState.LOADING,
        currentBaseAction.action
      );
    } else if (currentBaseAction.action.startsWith('Idle')) {
      animationControllerRef.current.transitionTo(AnimationState.IDLE);
    } else {
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


  // Animation and scaling update loop
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Update animations
    animationControllerRef.current?.update(delta);

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

    // Update scale with smooth transition
    if (scene && positionControllerRef.current) {
      const newScale = positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
      scene.scale.copy(newScale);
    }
  });

  // Get current position from controller
  const position = positionControllerRef.current?.getPosition() || AVATAR_POSITION;

  return (
    <group
      position={position}
      rotation={AVATAR_ROTATION}
    >
      <primitive object={scene} />
    </group>
  );
}