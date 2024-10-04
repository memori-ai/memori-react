import React, { useEffect, useMemo } from 'react';
import { Object3D, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { useGraph, dispose } from '@react-three/fiber';
import { useAvatarBlink } from '../../utils/useEyeBlink';
import useHeadMovement from '../../utils/useHeadMovement';
import useMouthSpeaking from '../../utils/useMouthSpeaking';
import { hideHands } from '../../utils/utils';


interface HalfBodyAvatarProps {
  url: string;
  setMorphTargetInfluences: (morphTargetInfluences: any) => void;
  headMovement?: boolean;
  speaking?: boolean;
  onLoaded?: () => void;
}

const AVATAR_POSITION = new Vector3(0, -0.6, 0);

export default function HalfBodyAvatar({
  url,
  setMorphTargetInfluences,
  headMovement,
  speaking,
  onLoaded,
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
  useMouthSpeaking(!!speaking, nodes);

  useEffect(() => {
    const setupAvatar = () => {
      hideHands(nodes);
      correctMaterials(materials);
      onLoaded?.();
    };

    setupAvatar();

    return () => {
      const disposeObjects = () => {
        Object.values(materials).forEach(dispose);
        Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
      };

      disposeObjects();
    };
  }, [materials, nodes, url, onLoaded]);

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
