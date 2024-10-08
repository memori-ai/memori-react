import React, { useEffect, useMemo, useRef } from 'react';
import { Object3D, SkinnedMesh, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useGraph, dispose, useFrame } from '@react-three/fiber';
import { useAvatarBlink } from '../../utils/useEyeBlink';
import useHeadMovement from '../../utils/useHeadMovement';
import { hideHands } from '../../utils/utils';


interface HalfBodyAvatarProps {
  url: string;
  setMorphTargetInfluences: (morphTargetInfluences: any) => void;
  headMovement?: boolean;
  speaking?: boolean;
  onLoaded?: () => void;
  setMeshRef: (mesh: Object3D) => void;
  clearVisemes: () => void;
  setMorphTargetDictionary: (morphTargetDictionary: any) => void;
  eyeBlink?: boolean;
  morphTargetInfluences: any;
}

const AVATAR_POSITION = new Vector3(0, -0.6, 0);
const lerp = (start: number, end: number, alpha: number): number => {
  return start * (1 - alpha) + end * alpha;
};
export default function HalfBodyAvatar({
  url,
  setMorphTargetInfluences,
  setMorphTargetDictionary,
  headMovement,
  eyeBlink,
  setMeshRef,
  onLoaded,
  clearVisemes,
  morphTargetInfluences,
}: HalfBodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);
  const avatarMeshRef = useRef<SkinnedMesh | null>(null);

  useAvatarBlink({
    enabled: eyeBlink || false,
    setMorphTargetInfluences,
    config: {
      minInterval: 1500,
      maxInterval: 4000,
      blinkDuration: 120
    }
  });
  useHeadMovement(headMovement, nodes);

  useEffect(() => {
    const setupAvatar = () => {
      hideHands(nodes);
      correctMaterials(materials);
      // Set mesh reference for the first SkinnedMesh found
      const firstSkinnedMesh = Object.values(nodes).find(isSkinnedMesh) as SkinnedMesh;
      if (firstSkinnedMesh) {
        setMeshRef(firstSkinnedMesh);
        avatarMeshRef.current = firstSkinnedMesh;
        if (firstSkinnedMesh.morphTargetDictionary && firstSkinnedMesh.morphTargetInfluences) {
          setMorphTargetDictionary(firstSkinnedMesh.morphTargetDictionary);
          const initialInfluences = Object.keys(
            firstSkinnedMesh.morphTargetDictionary
          ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
          setMorphTargetInfluences(initialInfluences);
        }
      }
      onLoaded?.();
    };

    setupAvatar();

    return () => {
      const disposeObjects = () => {
        Object.values(materials).forEach(dispose);
        Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
        clearVisemes();
      };

      disposeObjects();
    };
  }, [materials, nodes, url, onLoaded, clearVisemes]);

  const skinnedMeshes = useMemo(
    () => Object.values(nodes).filter(isSkinnedMesh),
    [nodes]
  );

    // Update morph target influences
    useFrame((_) => {
      if (avatarMeshRef.current && avatarMeshRef.current.morphTargetDictionary) {
        updateMorphTargetInfluences();
      }
  
      function updateMorphTargetInfluences() {
        Object.entries(morphTargetInfluences).forEach(([key, value]) => {
          const index = avatarMeshRef.current!.morphTargetDictionary![key];
          if (typeof index === 'number' &&
            avatarMeshRef.current!.morphTargetInfluences) {
            const currentValue = avatarMeshRef.current!.morphTargetInfluences[index];
            const smoothValue = lerp(currentValue, value as number, 0.1);
            avatarMeshRef.current!.morphTargetInfluences[index] = smoothValue;
          }
        });
      }
  });


  return (
    <group position={AVATAR_POSITION}>
      {nodes.Hips && <primitive key="armature" object={nodes.Hips} />}
      {skinnedMeshes.map(
        (node: Object3D) =>
          node && (
            <primitive key={node.name} object={node} receiveShadow castShadow />
          )
      )}
    </group>
  );
}
