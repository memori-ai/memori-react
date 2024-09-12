import { Nodes } from './utils';
import { SkinnedMesh } from 'three';
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface MouthState {
  moveTime: number;
  mesh: SkinnedMesh | null;
  morphIndices: {
    open: number;
    smile: number;
    funner: number;
    pucker: number;
  };
}

const MOUTH_MOVE_DURATION = 2;
const MOUTH_MOVE_INTERVAL_MIN = 100;
const MOUTH_MOVE_INTERVAL_MAX = 500;

export default function useMouthSpeaking(speaking: boolean | undefined, nodes: Nodes) {
  const mouthStateRef = useRef<MouthState>({
    moveTime: 999,
    mesh: null,
    morphIndices: { open: 0, smile: 0, funner: 0, pucker: 0 },
  });

  const setNextMouthMove = useCallback(() => {
    mouthStateRef.current.moveTime = 0;
    const nextMoveDelay = Math.random() * (MOUTH_MOVE_INTERVAL_MAX - MOUTH_MOVE_INTERVAL_MIN) + MOUTH_MOVE_INTERVAL_MIN;
    setTimeout(setNextMouthMove, nextMoveDelay);
  }, []);

  useEffect(() => {
    if (!speaking) return;

    const mouthMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar || nodes.Wolf3D_Avatar001) as SkinnedMesh;
    mouthStateRef.current.mesh = mouthMesh;

    if (mouthMesh?.morphTargetDictionary && mouthMesh?.morphTargetInfluences) {
      mouthStateRef.current.morphIndices = {
        open: mouthMesh.morphTargetDictionary.mouthOpen,
        smile: mouthMesh.morphTargetDictionary.mouthSmile,
        funner: mouthMesh.morphTargetDictionary.mouthFunner,
        pucker: mouthMesh.morphTargetDictionary.mouthPucker,
      };
    }

    const initialMoveDelay = setTimeout(setNextMouthMove, 200);

    return () => {
      clearTimeout(initialMoveDelay);
    };
  }, [nodes, speaking, setNextMouthMove]);

  useFrame((_, delta) => {
    const { moveTime, mesh, morphIndices } = mouthStateRef.current;

    if (!speaking || !mesh?.morphTargetInfluences) {
      resetMouthShape(mesh, morphIndices);
      return;
    }

    if (moveTime < MOUTH_MOVE_DURATION) {
      const value = Math.abs(Math.sin((moveTime * Math.PI) / 2));
      mouthStateRef.current.moveTime += delta * 10;
      updateMouthShape(mesh, morphIndices, value);
    } else {
      resetMouthShape(mesh, morphIndices);
    }
  });
}

function updateMouthShape(mesh: SkinnedMesh, morphIndices: MouthState['morphIndices'], value: number) {
  mesh.morphTargetInfluences![morphIndices.open] = value / 3;
  mesh.morphTargetInfluences![morphIndices.smile] = value / 10;
  mesh.morphTargetInfluences![morphIndices.funner] = value / 7;
  mesh.morphTargetInfluences![morphIndices.pucker] = value / 5;
}

function resetMouthShape(mesh: SkinnedMesh | null, morphIndices: MouthState['morphIndices']) {
  if (!mesh?.morphTargetInfluences) return;
  mesh.morphTargetInfluences[morphIndices.open] = 0;
  mesh.morphTargetInfluences[morphIndices.smile] = 0;
  mesh.morphTargetInfluences[morphIndices.funner] = 0;
  mesh.morphTargetInfluences[morphIndices.pucker] = 0;
}
