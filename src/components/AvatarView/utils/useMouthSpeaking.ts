import { Nodes } from './utils';
import { SkinnedMesh } from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

let mouthMoveTime: number = 999;
let timeout: NodeJS.Timeout;

let mouthMesh: SkinnedMesh;
let mouthOpenMorphIndex: number = 0;
let mouthSmileMorphIndex: number = 0;
let mouthFunnerMorphIndex: number = 0;
let mouthPuckerMorphIndex: number = 0;

const setNextMouthOpen = () => {
  mouthMoveTime = 0;
  timeout = setTimeout(setNextMouthOpen, Math.random() * 500);
};

// https://learn.microsoft.com/it-it/azure/cognitive-services/speech-service/how-to-speech-synthesis-viseme?tabs=visemeid&pivots=programming-language-javascript

export default function useMouthSpeaking(
  speaking: boolean | undefined,
  nodes: Nodes
) {
  useEffect(() => {
    if (!speaking) return;

    mouthMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;

    if (mouthMesh?.morphTargetDictionary && mouthMesh?.morphTargetInfluences) {
      mouthOpenMorphIndex = mouthMesh.morphTargetDictionary.mouthOpen;
      mouthSmileMorphIndex = mouthMesh.morphTargetDictionary.mouthSmile;
      mouthFunnerMorphIndex = mouthMesh.morphTargetDictionary.mouthFunner;
      mouthPuckerMorphIndex = mouthMesh.morphTargetDictionary.mouthPucker;
    }

    timeout = setTimeout(setNextMouthOpen, 200);
    // timeout = setTimeout(visemeDD = 0.4, start - audioOffset);

    return () => {
      clearTimeout(timeout);
    };
  }, [nodes, speaking]);

  useFrame((_, delta) => {
    if (!speaking) {
      if (mouthMesh?.morphTargetInfluences) {
        mouthMesh.morphTargetInfluences[mouthOpenMorphIndex] = 0;
        mouthMesh.morphTargetInfluences[mouthSmileMorphIndex] = 0;
        mouthMesh.morphTargetInfluences[mouthFunnerMorphIndex] = 0;
        mouthMesh.morphTargetInfluences[mouthPuckerMorphIndex] = 0;
      }
    } else if (mouthMoveTime < 2 && mouthMesh?.morphTargetInfluences) {
      let value = Math.abs(Math.sin((mouthMoveTime * Math.PI) / 2));
      mouthMoveTime += delta * 10;
      mouthMesh.morphTargetInfluences[mouthOpenMorphIndex] = value / 3;
      mouthMesh.morphTargetInfluences[mouthSmileMorphIndex] = value / 10;
      mouthMesh.morphTargetInfluences[mouthFunnerMorphIndex] = value / 7;
      mouthMesh.morphTargetInfluences[mouthPuckerMorphIndex] = value / 5;
    } else if (mouthMesh?.morphTargetInfluences) {
      mouthMesh.morphTargetInfluences[mouthOpenMorphIndex] = 0;
      mouthMesh.morphTargetInfluences[mouthSmileMorphIndex] = 0;
      mouthMesh.morphTargetInfluences[mouthFunnerMorphIndex] = 0;
      mouthMesh.morphTargetInfluences[mouthPuckerMorphIndex] = 0;
    }
  });
}
