import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { AnimationAction, Vector3, Scene, SkinnedMesh, Object3D } from 'three';
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

// Enhanced props interface for FullbodyAvatar
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
  // New prop to expose animator to parent component
  setAnimatorRef?: (animator: AvatarAnimator | null) => void;
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
  setAnimatorRef,
}: FullbodyAvatarProps) {
  // Load the avatar model and its animations
  const { scene, animations: baseAnimations } = useGLTF(url);

  // Load additional animations based on sex (fallback animations)
  const { animations: additionalAnimations } = useGLTF(ANIMATION_URLS[sex]);

  // Check if avatar needs additional animations
  const needsAdditionalAnimations = useMemo(() => {
    let found = false;
    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' ||
          object.name === 'Wolf3D_Avatar' ||
          object.name === 'Wolf3D_Avatar006_1')
      ) {
        found = true;
      }
    });
    return found;
  }, [scene]);

  // Merge base and additional animations only if needed
  const mergedAnimations = useMemo(
    () => needsAdditionalAnimations ? [...baseAnimations, ...additionalAnimations] : baseAnimations,
    [baseAnimations, additionalAnimations, needsAdditionalAnimations]
  );

  // Create animation actions from the merged animations
  const { actions } = useAnimations(mergedAnimations, scene);

  // System controllers - use refs to maintain instance across renders
  const morphTargetControllerRef = useRef<MorphTargetController | null>(null);
  const positionControllerRef = useRef<AvatarPositionController | null>(null);
  const animatorRef = useRef<AvatarAnimator | null>(null);

  // Reference to track initialization status
  const isInitializedRef = useRef<boolean>(false);

  // For position tracking and updates
  const lastPositionRef = useRef<Vector3>(AVATAR_POSITION.clone());
  const positionUpdateThrottleRef = useRef<number>(0);
  const POSITION_UPDATE_INTERVAL = 1; // ~1000fps for more frequent updates


  const [isRpm, setIsRpm] = useState(false);

  // For eye blinking
  const blinkStateRef = useRef({
    isBlinking: false,
    lastBlinkTime: 0,
    nextBlinkTime: 0,
    blinkStartTime: 0,
  });

  // Find head mesh and initialize morph target controller - only run when scene changes
  useEffect(() => {
    if (!scene) return;

    // Find head mesh
    let headMesh: SkinnedMesh | null = null;
    scene.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' ||
          object.name === 'Wolf3D_Avatar' ||
          object.name === 'Wolf3D_Avatar006_1')
      ) {

        if(object.name === 'Wolf3D_Avatar' ||
          object.name === 'Wolf3D_Avatar006_1') {
          setIsRpm(true);
          console.log('RPM avatar detected');
        }
        headMesh = object;
      }
    });

    // Initialize morph target controller if head mesh found
    if (headMesh) {
      // Only create a new controller if one doesn't exist
      if (!morphTargetControllerRef.current) {
        morphTargetControllerRef.current = new MorphTargetController(headMesh);
      }
    }
  }, [scene]); // Only re-run if scene changes

  // Initialize position controller once
  useEffect(() => {
    if (!positionControllerRef.current) {
      positionControllerRef.current = new AvatarPositionController(
        AVATAR_POSITION
      );
    }
    
    // Cleanup function
    return () => {
      // No need to dispose the position controller here
    };
  }, []); // Empty dependency array means this runs once

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

  // Initialize animator only once and cleanup properly
  useEffect(() => {
    // Only initialize if not already initialized and dependencies are available
    if (!scene || !actions || isInitializedRef.current) {
      return;
    }

    console.log('Initializing animator');

    // Create the animator only once
    if (!animatorRef.current) {
      animatorRef.current = new AvatarAnimator();
    }

    const animator = animatorRef.current;

    const initWithPreloadedAnimations = async () => {
      try {
        // Prevent multiple initializations
        if (animator.isInitialized()) {
          console.log('Animator already initialized, skipping initialization');
          return;
        }

        // Initialize animator with avatar animations first, then fallback animations
        await animator.initialize(
          scene as unknown as Scene,
          actions as Record<string, AnimationAction>,
          mergedAnimations,
          isRpm ? 'RPM' : 'CUSTOM_GLB'
        );

        console.log(
          'AvatarAnimator initialized with',
          Object.keys(actions).length,
          'animations'
        );

        // Expose animator to parent component if callback provided
        if (setAnimatorRef) {
          setAnimatorRef(animator);
        }

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
      // Only clean up if we created it in this component
      if (animatorRef.current && isInitializedRef.current) {
        console.log('Cleaning up animator');

        // Dispose mixer if needed
        if ('mixer' in animatorRef.current && animatorRef.current['mixer']) {
          (animatorRef.current['mixer'] as any).stopAllAction();
        }

        // Clear reference in parent component
        if (setAnimatorRef) {
          setAnimatorRef(null);
        }

        // Reset references
        isInitializedRef.current = false;
        // Don't null out animatorRef here to prevent flickering during re-renders
      }
    };
  }, [scene, actions, mergedAnimations, sex, setAnimatorRef]);

  // Memoize the frame callback to prevent creating a new function every render
  const frameCallback = useCallback((state: any, delta: number) => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Update animation system
    if (animatorRef.current && isInitializedRef.current) {
      animatorRef.current.update(delta);
    }

    // Update morph targets for facial expressions and visemes
    if (morphTargetControllerRef.current) {
      const currentViseme = updateCurrentViseme(currentTime / 1000);

      morphTargetControllerRef.current.updateMorphTargets(
        currentTime,
        chatEmission,
        loading,
        currentViseme,
        eyeBlink,
        blinkStateRef.current
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
  }, [scene, updateCurrentViseme, chatEmission, loading, eyeBlink]);

  // Use the memoized callback in useFrame
  useFrame(frameCallback);

  // Get current position from controller with fallback - memoize to prevent recreation
  const position = useMemo(() => {
    return (
      positionControllerRef.current?.getPosition() || AVATAR_POSITION.clone()
    );
  }, []);

  return (
    <>
      <DynamicShadow animator={animatorRef.current} avatarPosition={position} />
      <group position={position} rotation={AVATAR_ROTATION}>
        <primitive object={scene} />
      </group>
    </>
  );
}

// Avoid using React.memo here as it's exported as a named function
// The parent component should handle memoization if needed