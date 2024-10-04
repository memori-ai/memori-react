// Import necessary dependencies
import React, { useEffect, useRef, useState } from 'react';
import {
  Vector3,
  Euler,
  AnimationMixer,
  SkinnedMesh,
  Object3D
} from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useAvatarBlink } from '../../utils/useEyeBlink';
import { useViseme } from '../../utils/useViseme';

// Define the props interface for the FullbodyAvatar component
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
  eyeBlink?: boolean;
}

// Define constants for avatar positioning
const AVATAR_POSITION = new Vector3(0, -1, 0);
const AVATAR_ROTATION = new Euler(0.175, 0, 0);
const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

// Define URLs for male and female animation assets
const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/1c350a21-97d8-4add-82cc-9dc10767a26b.glb',
  FEMALE: 'https://assets.memori.ai/api/v2/asset/a1908dbf-8ce8-438d-90df-acf9dc2604ad.glb',
};

// Define the FullbodyAvatar component
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
  eyeBlink
}: FullbodyAvatarProps) {
  // Load the 3D model and animations
  const { scene } = useGLTF(url);
  const { animations } = useGLTF(ANIMATION_URLS[sex]);
  const { nodes, materials } = useGraph(scene);
  const { actions } = useAnimations(animations, scene);
  const [mixer] = useState(() => new AnimationMixer(scene));
  
  // Create a ref for the SkinnedMesh
  const avatarMeshRef = useRef<SkinnedMesh>();

  useAvatarBlink({
    enabled: eyeBlink || false,
    setMorphTargetInfluences,
    config: {
      minInterval: 1500,
      maxInterval: 4000,
      blinkDuration: 120
    }
  });

  
  
  // Effect to setup morphTargets and cleanup
  useEffect(() => {
    // Correct materials for the avatar
    correctMaterials(materials);
    
    // Find the avatar mesh
    scene.traverse((object: Object3D) => {
      if (object instanceof SkinnedMesh && object.name === 'Wolf3D_Avatar020') {
        avatarMeshRef.current = object;
        
        // Set up morph target dictionary and influences
        if (object.morphTargetDictionary && object.morphTargetInfluences) {
          setMorphTargetDictionary(object.morphTargetDictionary);
          
          // Create an object with all morph target influences set to 0
          const initialInfluences = Object.keys(object.morphTargetDictionary).reduce(
            (acc, key) => ({ ...acc, [key]: 0 }),
            {}
          );
          setMorphTargetInfluences(initialInfluences);
        }
      }
    });

    // Call onLoaded callback if provided
    onLoaded?.();

    // Cleanup function
    return () => {
      Object.values(materials).forEach(dispose);
      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded, setMorphTargetDictionary, setMorphTargetInfluences]);

  // Effect to handle animation changes
  useEffect(() => {
    if (!actions || !currentBaseAction.action) return;
    
    const newAction = actions[currentBaseAction.action];
    if (!newAction) {
      console.warn(`Animation "${currentBaseAction.action}" not found in actions.`);
      return;
    }

    const fadeOutDuration = 0.8;
    const fadeInDuration = 0.8;

    // Set the timeScale and play the new action
    newAction.timeScale = timeScale;
    newAction.reset().fadeIn(fadeInDuration).play();

    // Cleanup function to fade out the action
    return () => {
      newAction.fadeOut(fadeOutDuration);
    };
  }, [currentBaseAction, timeScale, actions]);

  // Frame update for morph target influences and animation mixer
  useFrame((_, delta) => {
    // Update morph target influences
    if (avatarMeshRef.current && avatarMeshRef.current.morphTargetDictionary) {
      Object.entries(morphTargetInfluences).forEach(([key, value]) => {
        const index = avatarMeshRef.current!.morphTargetDictionary![key];
        if (typeof index === 'number' && avatarMeshRef.current!.morphTargetInfluences) {
          avatarMeshRef.current!.morphTargetInfluences[index] = value;
        }
      });
    }
    
    // Update the animation mixer
    mixer.update(delta * 0.001);
  });

  // Render the avatar
  return (
    <group
      position={isZoomed ? AVATAR_POSITION_ZOOMED : AVATAR_POSITION}
      rotation={AVATAR_ROTATION}
    >
      <primitive object={scene} />
    </group>
  );
}