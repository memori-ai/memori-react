import { useEffect, useMemo, useRef } from 'react';
import { Object3D, SkinnedMesh } from 'three';
import { useGLTF } from '@react-three/drei';
import { useGraph, useFrame, useThree } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { MorphTargetController } from './controllers/MorphTargetController';
import { AvatarPositionController } from './controllers/AvatarPositionController';
import {
  AVATAR_POSITION,
  SCALE_LERP_FACTOR,
  AVATAR_POSITION_ZOOMED,
} from '../constants';
import { hideHands } from '../../utils/utils';
import useHeadMovement from '../../utils/useHeadMovement';

interface HalfBodyAvatarProps {
  url: string;
  updateCurrentViseme: (currentTime: number) => any;
  eyeBlink?: boolean;
  avatarHeight: number;
  avatarDepth: number;
  onLoaded?: () => void;
  onCameraZChange: (value: number) => void;
  headMovement?: boolean;
  chatEmission?: any;
  loading?: boolean;
}

export default function HalfBodyAvatar({
  url,
  updateCurrentViseme,
  eyeBlink = false,
  avatarHeight = 50,
  avatarDepth = 0,
  headMovement = false,
  onLoaded,
  onCameraZChange,
  chatEmission,
  loading = false,
}: HalfBodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);
  const { camera } = useThree();

  const morphTargetControllerRef = useRef<MorphTargetController | null>(null);
  const positionControllerRef = useRef<AvatarPositionController | null>(null);
  const targetCameraZRef = useRef(camera.position.z);

  // Apply head movement if enabled
  useHeadMovement(headMovement, nodes);
  

  // Eye blinking state
  const blinkStateRef = useRef({
    isBlinking: false,
    lastBlinkTime: 0,
    nextBlinkTime: 0,
    blinkStartTime: 0,
  });

  // Find head mesh
  const headMesh = useMemo(() => {
    let foundMesh: SkinnedMesh | undefined;
    scene?.traverse((object: Object3D) => {
      if (
        object instanceof SkinnedMesh &&
        (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')
      ) {
        foundMesh = object;
      }
    });
    return foundMesh;
  }, [scene]);

  // Initialize controllers
  useEffect(() => {
    if (!positionControllerRef.current) {
      positionControllerRef.current = new AvatarPositionController(
        AVATAR_POSITION,
        AVATAR_POSITION_ZOOMED,
      );
    }

    // Initialize MorphTargetController if head mesh exists
    if (headMesh) {
      morphTargetControllerRef.current = new MorphTargetController(headMesh);
    }

    // Correct materials and perform other initialization tasks
    correctMaterials(materials);
    onLoaded?.();
    hideHands(nodes);
    
    // Cleanup on unmount
    return () => {
      Object.values(materials).forEach(material => material.dispose());
      Object.values(nodes)
        .filter(isSkinnedMesh)
        .forEach(mesh => mesh.geometry.dispose());
    };
  }, [materials, nodes, url, onLoaded, scene, headMesh]);

  // Handle avatar height changes
  useEffect(() => {
    if (positionControllerRef.current) {
      positionControllerRef.current.updateHeight(avatarHeight, true);
    }
  }, [avatarHeight]);

  // Handle avatar depth changes
  useEffect(() => {
    if (positionControllerRef.current && onCameraZChange) {
      const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, true);
      onCameraZChange(newCameraZ);
    }
  }, [avatarDepth, onCameraZChange]);

  // Animation and morphing update loop
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Update morph targets
    if (morphTargetControllerRef.current) {
      const currentViseme = updateCurrentViseme(currentTime / 1000);
      
      // Use the updated MorphTargetController that handles chat emission directly
      morphTargetControllerRef.current.updateMorphTargets(
        currentTime,
        chatEmission,
        loading,
        currentViseme,
        eyeBlink,
        blinkStateRef.current,
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
    <group position={position}>
      <primitive object={scene} />
    </group>
  );
}