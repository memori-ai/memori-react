import { Nodes } from './utils';
import { SkinnedMesh } from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

let headMesh: SkinnedMesh;
let mouthSmileMorphIndex: number = 0;

export default function useSmile(smiling: boolean | undefined, nodes: Nodes) {
  useEffect(() => {
    if (!smiling) return;

    headMesh = (nodes.Wolf3D_Head ||
      nodes.Wolf3D_Avatar ||
      nodes.Wolf3D_Avatar001) as SkinnedMesh;

    if (headMesh?.morphTargetDictionary && headMesh?.morphTargetInfluences) {
      mouthSmileMorphIndex = headMesh.morphTargetDictionary.mouthSmile;
    }
  }, [nodes, smiling]);

  useFrame(() => {
    if (!smiling) {
      if (headMesh?.morphTargetInfluences) {
        headMesh.morphTargetInfluences[mouthSmileMorphIndex] = 0;
      }
    } else if (headMesh?.morphTargetInfluences) {
      headMesh.morphTargetInfluences[mouthSmileMorphIndex] = 1 / 3;
    }
  });
}
