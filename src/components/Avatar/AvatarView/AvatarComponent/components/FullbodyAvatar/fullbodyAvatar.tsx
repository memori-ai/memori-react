import { useEffect, useRef, useMemo } from 'react';
import {
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  AnimationAction,
  Vector3
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { AnimationState, FullbodyAvatarProps } from './types';
import { AnimationController } from '../controllers/AnimationController';
import { MorphTargetController } from '../controllers/MorphTargetController';
import { AvatarPositionController } from '../controllers/AvatarPositionController';
import {
  AVATAR_POSITION,
  AVATAR_ROTATION,
  AVATAR_POSITION_ZOOMED,
  ANIMATION_URLS,
  DEFAULT_CONFIG,
  SCALE_LERP_FACTOR,
} from '../../constants';
import DynamicShadow from '../../Shadow/DynamicShadow';

export function FullbodyAvatar({
  url,
  sex,
  setIsRpm,
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
  const { animations: baseAnimations } = useGLTF(url);
  const { animations: additionalAnimations } = useGLTF(ANIMATION_URLS[sex]); 
  const mergedAnimations = useMemo(() => [...baseAnimations, ...additionalAnimations], [baseAnimations, additionalAnimations]);
  const { actions } = useAnimations(mergedAnimations, scene);

  const animationControllerRef = useRef<AnimationController>();
  const morphTargetControllerRef = useRef<MorphTargetController>();
  const positionControllerRef = useRef<AvatarPositionController>();
  const lastPositionRef = useRef<Vector3>(AVATAR_POSITION.clone());
  const positionUpdateThrottleRef = useRef<number>(0);
  const POSITION_UPDATE_INTERVAL = 1; // ~1000fps for more frequent updates
  const POSITION_THRESHOLD = 0.000001; // Much smaller threshold for more sensitive detection
  
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

    // Initialize position tracking with high precision
    const initialPosition = AVATAR_POSITION.clone();
    initialPosition.setX(Number(initialPosition.x.toFixed(6)));
    initialPosition.setY(Number(initialPosition.y.toFixed(6)));
    initialPosition.setZ(Number(initialPosition.z.toFixed(6)));
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
        (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')
      ) {
        if(object.name === 'GBNL__Head') {
          setIsRpm(false);
        } else {
          setIsRpm(true);
        }
        foundMesh = object;
      }
    });
    return foundMesh;
  }, [scene]);

  // Handle animation state changes
  useEffect(() => {
    if (!animationControllerRef.current) return;

    if (currentBaseAction.action.startsWith('Loading')) {
      animationControllerRef.current.updateIsChatAlreadyStarted(true);
      animationControllerRef.current.transitionTo(
        AnimationState.LOADING,
        currentBaseAction.action
      );
    } else if (currentBaseAction.action.includes('->')) {
      animationControllerRef.current.playSequence(currentBaseAction.action);
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

  // Animation and scaling update loop with high precision position tracking
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

    // Update scale and check position changes with high precision
    if (scene && positionControllerRef.current) {
      const newScale = positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
      scene.scale.copy(newScale);

      // High frequency position update check
      if (currentTime - positionUpdateThrottleRef.current >= POSITION_UPDATE_INTERVAL) {
        const currentPosition = positionControllerRef.current.getPosition();
        
        // Round to 6 decimal places for high precision
        currentPosition.setX(Number(currentPosition.x.toFixed(6)));
        currentPosition.setY(Number(currentPosition.y.toFixed(6)));
        currentPosition.setZ(Number(currentPosition.z.toFixed(6)));
        
        const positionDelta = currentPosition.distanceTo(lastPositionRef.current);
        
        lastPositionRef.current.copy(currentPosition);
        
        positionUpdateThrottleRef.current = currentTime;
      }
    }
  });

  // Get current position from controller with fallback
  const position = useMemo(() => {
    return positionControllerRef.current?.getPosition() || AVATAR_POSITION.clone();
  }, [positionControllerRef.current]);

  return (
    <>
    <DynamicShadow
      currentBaseAction={currentBaseAction}
      avatarPosition={position}
    />
    <group
      position={position}
      rotation={AVATAR_ROTATION}
    >
      <primitive object={scene} />
    </group>
    </>
  );
}