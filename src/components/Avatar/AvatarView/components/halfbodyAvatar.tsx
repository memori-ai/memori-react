import React, { useEffect, useMemo } from 'react';
import { Object3D, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import useEyeBlink from '../utils/useEyeBlink';
import useHeadMovement from '../utils/useHeadMovement';
import useMouthSpeaking from '../utils/useMouthSpeaking';
import { dispose, useGraph } from '@react-three/fiber';
import { correctMaterials, hideHands, isSkinnedMesh } from '../utils/utils';

interface HalfBodyAvatarProps {
  url: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  speaking?: boolean;
  onLoaded?: () => void;
}

const AVATAR_POSITION = new Vector3(0, -0.6, 0);

export default function HalfBodyAvatar({
  url,
  eyeBlink,
  headMovement,
  speaking,
  onLoaded,
}: HalfBodyAvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);

  useEyeBlink(eyeBlink, nodes);
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
