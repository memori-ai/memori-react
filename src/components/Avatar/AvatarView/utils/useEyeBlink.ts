import { SkinnedMesh } from 'three';
import { Nodes } from './utils';
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface BlinkState {
  blinkTime: number;
  headMesh: SkinnedMesh | null;
  morphIndex: number;
}

const BLINK_DURATION = 2;
const BLINK_INTERVAL_MIN = 2000;
const BLINK_INTERVAL_MAX = 7000;

export default function useEyeBlink(enabled: boolean | undefined, nodes: Nodes) {
  const blinkStateRef = useRef<BlinkState>({
    blinkTime: 999,
    headMesh: null,
    morphIndex: 0,
  });

  const setNextBlink = useCallback(() => {
    blinkStateRef.current.blinkTime = 0;
    const nextBlinkDelay = Math.random() * (BLINK_INTERVAL_MAX - BLINK_INTERVAL_MIN) + BLINK_INTERVAL_MIN;
    setTimeout(setNextBlink, nextBlinkDelay);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;
    blinkStateRef.current.headMesh = headMesh;

    if (headMesh?.morphTargetDictionary && headMesh?.morphTargetInfluences) {
      blinkStateRef.current.morphIndex = headMesh.morphTargetDictionary.eyesClosed;
    }

    const initialBlinkDelay = setTimeout(setNextBlink, 3000);

    return () => {
      clearTimeout(initialBlinkDelay);
    };
  }, [nodes, enabled, setNextBlink]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const { blinkTime, headMesh, morphIndex } = blinkStateRef.current;

    if (blinkTime < BLINK_DURATION && headMesh?.morphTargetInfluences) {
      const value = Math.abs(Math.sin((blinkTime * Math.PI) / 2));
      blinkStateRef.current.blinkTime += delta * 10;
      headMesh.morphTargetInfluences[morphIndex] = value;
    } else if (headMesh?.morphTargetInfluences) {
      headMesh.morphTargetInfluences[morphIndex] = 0;
    }
  });
}
