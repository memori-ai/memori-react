export enum AnimationState {
  LOADING = 'LOADING',
  EMOTION = 'EMOTION',
  IDLE = 'IDLE',
}

export interface AnimationConfig {
  fadeInDuration: number;
  fadeOutDuration: number;
  idleCount: number;
  timeScale: number;
}

export interface FullbodyAvatarProps {
  url: string;
  sex: 'MALE' | 'FEMALE';
  onLoaded?: () => void;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  timeScale: number;
  onCameraZChange: (value: number) => void;
  eyeBlink?: boolean;
  avatarDepth?: number;
  avatarHeight?: number;
  stopProcessing: () => void;
  resetVisemeQueue: () => void;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
  smoothMorphTarget?: boolean;
  morphTargetSmoothing?: number;
  morphTargetInfluences: Record<string, number>;
  setMorphTargetDictionary: (
    morphTargetDictionary: Record<string, number>
  ) => void;
  setMorphTargetInfluences: (
    morphTargetInfluences: Record<string, number>
  ) => void;
  emotionMorphTargets: Record<string, number>;
  halfBody: boolean;
}
