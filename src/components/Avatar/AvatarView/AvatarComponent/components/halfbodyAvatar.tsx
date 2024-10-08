import React, { useEffect, useMemo } from 'react';
import { Object3D, SkinnedMesh, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useGraph, dispose } from '@react-three/fiber';
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
}

const AVATAR_POSITION = new Vector3(0, -0.6, 0);

export default function HalfBodyAvatar({
  url,
  setMorphTargetInfluences,
  headMovement,
  setMeshRef,
  onLoaded,
  clearVisemes,
}: HalfBodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);

  useAvatarBlink({
    enabled: true,
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
        if (firstSkinnedMesh.morphTargetDictionary && firstSkinnedMesh.morphTargetInfluences) {
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
