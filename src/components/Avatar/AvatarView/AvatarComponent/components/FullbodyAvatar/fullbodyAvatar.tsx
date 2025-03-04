import { useEffect, useRef, useMemo, useState } from 'react';
import {
  AnimationMixer,
  SkinnedMesh,
  Object3D,
  AnimationAction,
  Vector3,
  Scene
} from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MorphTargetController } from '../controllers/MorphTargetController';
import { AvatarPositionController } from '../controllers/AvatarPositionController';
import { AvatarAnimator } from '../controllers/animations/AvatarAnimator';
import {
  AVATAR_POSITION,
  AVATAR_ROTATION,
  SCALE_LERP_FACTOR,
} from '../../constants';
import DynamicShadow from '../../Shadow/DynamicShadow';

// Updated props interface for FullbodyAvatar
export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  setIsRpm: (isRpm: boolean) => void;
  currentBaseAction: { action: string; weight: number }; // For backwards compatibility
  timeScale: number;
  eyeBlink: boolean;
  updateCurrentViseme: (currentTime: number) => { name: string; weight: number } | null;
  setMorphTargetDictionary: (dict: Record<string, number>) => void;
  setMorphTargetInfluences: (influences: Record<string, number>) => void;
  emotionMorphTargets: Record<string, number>;
  avatarHeight?: number;
  avatarDepth?: number;
  onCameraZChange?: (value: number) => void;
  resetVisemeQueue: () => void;
  stopProcessing: () => void;
  halfBody?: boolean;
  animationSources?: Record<string, any>; // Animation sources for the animator
  onAnimatorReady?: (animator: AvatarAnimator) => void; // Callback when animator is ready
}

export function FullbodyAvatar({
  url,
  // sex,
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
  animationSources,
  onAnimatorReady,
}: FullbodyAvatarProps) {
  // Load the avatar model
  const { scene } = useGLTF(url);
  
  // Animation system references
  const morphTargetControllerRef = useRef<MorphTargetController>();
  const positionControllerRef = useRef<AvatarPositionController>();
  const animatorRef = useRef<AvatarAnimator | null>(null);
  
  // For position tracking and updates
  const lastPositionRef = useRef<Vector3>(AVATAR_POSITION.clone());
  const positionUpdateThrottleRef = useRef<number>(0);
  const POSITION_UPDATE_INTERVAL = 1; // ~1000fps for more frequent updates
  
  // For eye blinking
  const blinkStateRef = useRef({
    isBlinking: false,
    lastBlinkTime: 0,
    nextBlinkTime: 0,
    blinkStartTime: 0,
  });

  // Initialize position controller
  useEffect(() => {
    if (!positionControllerRef.current) {
      positionControllerRef.current = new AvatarPositionController(AVATAR_POSITION);
    }
  }, []);

  // Handle avatar height changes
  useEffect(() => {
    if (positionControllerRef.current) {
      positionControllerRef.current.updateHeight(avatarHeight, false);
    }
  }, [avatarHeight]);

  // Handle avatar depth changes
  useEffect(() => {
    if (positionControllerRef.current && onCameraZChange) {
      const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, false);
      onCameraZChange(newCameraZ);
    }
  }, [avatarDepth, onCameraZChange]);

  // Find head mesh for morphing
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
  }, [scene, setIsRpm]);

  // Initialize the animation system
  useEffect(() => {
    if (!scene) return;
    
    // Create the animator
    const animator = new AvatarAnimator(animationSources);
    
    // Initialize the animator with the scene
    animator.initialize(scene as unknown as Scene)
      .then(() => {
        console.log('AvatarAnimator initialized');
        animatorRef.current = animator;
        
        // Set initial time scale
        animator.setTimeScale(timeScale);
        
        // Call the onAnimatorReady callback if provided
        if (onAnimatorReady) {
          onAnimatorReady(animator);
        }
      })
      .catch(error => {
        console.error('Error initializing AvatarAnimator:', error);
      });
    
    // Initialize morph target controller if we have a head mesh
    if (headMesh) {
      morphTargetControllerRef.current = new MorphTargetController(headMesh);
      
      if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
        setMorphTargetDictionary(headMesh.morphTargetDictionary);
        const initialInfluences = Object.keys(headMesh.morphTargetDictionary)
          .reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        setMorphTargetInfluences(initialInfluences);
      }
    }
    
    // Cleanup on unmount
    return () => {
      // Any cleanup logic here
    };
  }, [scene, timeScale, setMorphTargetDictionary, setMorphTargetInfluences, headMesh, animationSources, onAnimatorReady]);

  // Update time scale when it changes
  useEffect(() => {
    if (animatorRef.current) {
      animatorRef.current.setTimeScale(timeScale);
    }
  }, [timeScale]);

  // Animation and morphing update loop
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime * 1000;
    
    // Update animation system
    if (animatorRef.current) {
      animatorRef.current.update(delta);
    }
    
    // Update morph targets for facial expressions and visemes
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
    
    // Update position and scale
    if (scene && positionControllerRef.current) {
      // Update scale
      const newScale = positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
      scene.scale.copy(newScale);
      
      // High frequency position update check
      if (currentTime - positionUpdateThrottleRef.current >= POSITION_UPDATE_INTERVAL) {
        const currentPosition = positionControllerRef.current.getPosition();
        
        // Round to 6 decimal places for high precision
        currentPosition.setX(Number(currentPosition.x.toFixed(6)));
        currentPosition.setY(Number(currentPosition.y.toFixed(6)));
        currentPosition.setZ(Number(currentPosition.z.toFixed(6)));
        
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