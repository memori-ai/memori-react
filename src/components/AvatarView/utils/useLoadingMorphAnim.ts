import { Nodes } from './utils';
import { SkinnedMesh } from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

let headMesh: SkinnedMesh;
let eyesClosedMorphIndex: number = 0;
let viseme_UMorphIndex: number = 0;

export default function useLoadingMorphAnim(
  loading: boolean | undefined,
  nodes: Nodes
) {
  useEffect(() => {
    if (!loading) return;

    headMesh = (nodes.Wolf3D_Head ||
      nodes.Wolf3D_Avatar ||
      nodes.Wolf3D_Avatar001) as SkinnedMesh;

    if (headMesh?.morphTargetDictionary && headMesh?.morphTargetInfluences) {
      eyesClosedMorphIndex = headMesh.morphTargetDictionary.mouthOpen;
      viseme_UMorphIndex = headMesh.morphTargetDictionary.viseme_U;
    }
  }, [nodes, loading]);

  useFrame(() => {
    if (!loading) {
      if (headMesh?.morphTargetInfluences) {
        headMesh.morphTargetInfluences[eyesClosedMorphIndex] = 0;
        headMesh.morphTargetInfluences[viseme_UMorphIndex] = 0;
      }
    } else if (headMesh?.morphTargetInfluences) {
      headMesh.morphTargetInfluences[eyesClosedMorphIndex] = 0.56;
      headMesh.morphTargetInfluences[viseme_UMorphIndex] = 0.67;
    }
  });
}
