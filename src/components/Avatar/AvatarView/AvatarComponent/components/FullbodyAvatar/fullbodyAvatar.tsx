import { useEffect, useRef, useMemo } from 'react';
import {
  AnimationAction,
  Vector3,
  Scene,
  SkinnedMesh,
  Object3D
} from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MorphTargetController } from '../controllers/MorphTargetController';
import { AvatarPositionController } from '../controllers/AvatarPositionController';
import { AvatarAnimator } from '../controllers/AvatarAnimator';
import {
  ANIMATION_URLS,
  AVATAR_POSITION,
  AVATAR_ROTATION,
  SCALE_LERP_FACTOR,
} from '../../constants';
import DynamicShadow from '../../Shadow/DynamicShadow';

// Simplified props interface for FullbodyAvatar
export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  eyeBlink: boolean;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
  avatarHeight?: number;
  avatarDepth?: number;
  onCameraZChange?: (value: number) => void;
  chatEmission: any;
  loading: boolean;
}

export function FullbodyAvatar({
  url,
  sex,
  eyeBlink,
  updateCurrentViseme,
  avatarHeight = 50,
  avatarDepth = 0,
  onCameraZChange,
  chatEmission,
  loading,
}: FullbodyAvatarProps) {
  // Load the avatar model and its animations
  const { scene, animations: baseAnimations } = useGLTF(url);
  // Load additional animations based on sex
  const { animations: additionalAnimations } = useGLTF(ANIMATION_URLS[sex]);
  // Merge base and additional animations
  const mergedAnimations = useMemo(
    () => [...baseAnimations, ...additionalAnimations],
    [baseAnimations, additionalAnimations]
  );
  // Create animation actions from the merged animations
  const { actions } = useAnimations(mergedAnimations, scene);

  // System controllers
  const morphTargetControllerRef = useRef<MorphTargetController | null>(null);
  const positionControllerRef = useRef<AvatarPositionController | null>(null);
  const animatorRef = useRef<AvatarAnimator | null>(null);
  
  // Reference to track initialization status
  const isInitializedRef = useRef<boolean>(false);

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

  // Find head mesh and initialize morph target controller
  useEffect(() => {
    if (!scene) return;

    // Find head mesh
    let headMesh: SkinnedMesh | null = null;
    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')
      ) {
        headMesh = object;
      }
    });

    // Initialize morph target controller if head mesh found
    if (headMesh) {
      morphTargetControllerRef.current = new MorphTargetController(headMesh);
    }
  }, [scene]);

  // Initialize position controller
  useEffect(() => {
    if (!positionControllerRef.current) {
      positionControllerRef.current = new AvatarPositionController(
        AVATAR_POSITION
      );
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
      const newCameraZ = positionControllerRef.current.updateDepth(
        avatarDepth,
        false
      );
      onCameraZChange(newCameraZ);
    }
  }, [avatarDepth, onCameraZChange]);

  // Initialize the animation system - only once
  useEffect(() => {
    // Only initialize if not already initialized and dependencies are available
    if (!scene || !actions || isInitializedRef.current) return;

    console.log('Initializing animator');

    // Create the animator
    const animator = new AvatarAnimator();

    const initWithPreloadedAnimations = async () => {
      try {
        await animator.initialize(
          scene as unknown as Scene,
          actions as Record<string, AnimationAction>,
          mergedAnimations,
          sex === 'MALE' ? 'RPM' : 'CUSTOM_GLB'
        );

        console.log(
          'AvatarAnimator initialized with',
          Object.keys(actions).length,
          'animations'
        );
        
        // Store animator in ref
        animatorRef.current = animator;
        
        // Mark as initialized
        isInitializedRef.current = true;

        // Set initial time scale
        animator.setTimeScale(0.8);
      } catch (error) {
        console.error('Error initializing AvatarAnimator:', error);
      }
    };

    initWithPreloadedAnimations();

    // Cleanup on unmount
    return () => {
      // Dispose the animator
      if (animatorRef.current) {
        // Dispose mixer if needed
        if ('mixer' in animatorRef.current && animatorRef.current['mixer']) {
          (animatorRef.current['mixer'] as any).stopAllAction();
        }
        animatorRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [scene, actions, mergedAnimations, sex]);

  // Process chat emission changes for animations
  useEffect(() => {
    if (!animatorRef.current || !isInitializedRef.current) return;
    
    // Let the animator handle the chat emission processing
    animatorRef.current.processChatEmission(chatEmission, loading);
  }, [chatEmission, loading]);

  // Animation and morphing update loop
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Update animation system
    if (animatorRef.current && isInitializedRef.current) {
      animatorRef.current.update(delta);
    }

    // Update morph targets for facial expressions and visemes
    if (morphTargetControllerRef.current) {
      const currentViseme = updateCurrentViseme(currentTime / 1000);
      
      // Extract emotion data from chat emission - this would be handled by the MorphTargetController
      // in a real implementation with proper encapsulation
      let emotionMorphTargets = {};
      
      // Instead of trying to extract emotion data here, we should enhance the MorphTargetController
      // to handle chat emission processing for emotions like the AvatarAnimator does for animations
      
      morphTargetControllerRef.current.updateMorphTargets(
        currentTime,
        chatEmission,
        loading,
        currentViseme,
        eyeBlink,
        blinkStateRef.current,
      );
    }

    // Update position and scale
    if (scene && positionControllerRef.current) {
      // Update scale
      const newScale =
        positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
      scene.scale.copy(newScale);

      // High frequency position update check
      if (
        currentTime - positionUpdateThrottleRef.current >=
        POSITION_UPDATE_INTERVAL
      ) {
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
    return (
      positionControllerRef.current?.getPosition() || AVATAR_POSITION.clone()
    );
  }, [positionControllerRef.current]);

  return (
    <>
      <DynamicShadow
        animator={animatorRef.current}
        avatarPosition={position}
      />
      <group position={position} rotation={AVATAR_ROTATION}>
        <primitive object={scene} />
      </group>
    </>
  );
}