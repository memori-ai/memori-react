import { Nodes } from './utils';
import { SkinnedMesh } from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface SmileState {
  headMesh: SkinnedMesh | null;
  mouthSmileMorphIndex: number;
}

const SMILE_INTENSITY = 1 / 3;

export default function useSmile(smiling: boolean | undefined, nodes: Nodes) {
  const smileStateRef = useRef<SmileState>({
    headMesh: null,
    mouthSmileMorphIndex: 0,
  });

  useEffect(() => {
    const headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar020 || nodes.Wolf3D_Avatar001) as SkinnedMesh;
    smileStateRef.current.headMesh = headMesh;

    if (headMesh?.morphTargetDictionary && headMesh?.morphTargetInfluences) {
      smileStateRef.current.mouthSmileMorphIndex = headMesh.morphTargetDictionary.mouthSmile;
    }
  }, [nodes]);

  useFrame(() => {
    const { headMesh, mouthSmileMorphIndex } = smileStateRef.current;

    if (!headMesh?.morphTargetInfluences) return;

    const targetSmileIntensity = smiling ? SMILE_INTENSITY : 0;
    const currentSmileIntensity = headMesh.morphTargetInfluences[mouthSmileMorphIndex];

    // Smoothly interpolate between current and target smile intensity
    headMesh.morphTargetInfluences[mouthSmileMorphIndex] += (targetSmileIntensity - currentSmileIntensity) * 0.1;
  });
}
