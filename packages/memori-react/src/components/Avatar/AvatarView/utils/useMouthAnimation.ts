import React, { useRef } from 'react';
import { SkinnedMesh } from 'three';

const VISEME_SMOOTHING = 0.2;
const VISEME_SPEED_FACTOR = 0.44;

interface Viseme {
  name: string;
  duration: number;
  weight: number;
  startTime: number;
}

interface UseMouthAnimationProps {
  currentVisemes: Viseme[];
  avatarMeshRef: React.RefObject<SkinnedMesh>;
}

const lerp = (start: number, end: number, alpha: number): number => {
  return start * (1 - alpha) + end * alpha;
};

export function useMouthAnimation({ currentVisemes, avatarMeshRef }: UseMouthAnimationProps) {
  const visemeStartTimeRef = useRef(0);
  const currentVisemeWeightRef = useRef<{ [key: string]: number }>({});

  // Helper function to get current viseme information
  const getCurrentVisemeInfo = (elapsedTime: number) => {
    let currentVisemeIndex = 0;
    let accumulatedDuration = 0;

    while (
      currentVisemeIndex < currentVisemes.length &&
      accumulatedDuration <= elapsedTime
    ) {
      accumulatedDuration += currentVisemes[currentVisemeIndex].duration;
      currentVisemeIndex++;
    }

    return { currentVisemeIndex, accumulatedDuration };
  };

  // Helper function to apply the current viseme
  const applyCurrentViseme = (index: number, elapsedTime: number, accumulatedDuration: number) => {
    const currentViseme = currentVisemes[index - 1];
    const visemeProgress = (elapsedTime - (accumulatedDuration - currentViseme.duration)) / currentViseme.duration;
    const targetWeight = Math.sin(visemeProgress * Math.PI) * currentViseme.weight;

    // Smooth the transition between visemes
    if (!currentVisemeWeightRef.current[currentViseme.name]) {
      currentVisemeWeightRef.current[currentViseme.name] = 0;
    }
    currentVisemeWeightRef.current[currentViseme.name] = lerp(
      currentVisemeWeightRef.current[currentViseme.name],
      targetWeight,
      VISEME_SMOOTHING
    );

    const visemeIndex = avatarMeshRef.current?.morphTargetDictionary?.[currentViseme.name];
    if (typeof visemeIndex === 'number' && avatarMeshRef.current?.morphTargetInfluences) {
      avatarMeshRef.current.morphTargetInfluences[visemeIndex] = currentVisemeWeightRef.current[currentViseme.name];
    }
  };

  // Helper function to reset viseme animation
  const resetVisemeAnimation = (currentTime: number) => {
    visemeStartTimeRef.current = currentTime;
    currentVisemeWeightRef.current = {};
  };

  // Main function to handle viseme-based mouth movement
  const handleMouthMovement = (elapsedTime: number) => {
    if (currentVisemes.length === 0) return;

    const currentTime = elapsedTime * VISEME_SPEED_FACTOR;
    const visemeElapsedTime = currentTime - visemeStartTimeRef.current;

    const { currentVisemeIndex, accumulatedDuration } = getCurrentVisemeInfo(visemeElapsedTime);

    if (currentVisemeIndex > 0) {
      applyCurrentViseme(currentVisemeIndex, visemeElapsedTime, accumulatedDuration);
    }

    // Reset viseme animation if we've reached the end
    if (visemeElapsedTime > accumulatedDuration) {
      resetVisemeAnimation(currentTime);
    }
  };

  return {
    handleMouthMovement,
  };
}