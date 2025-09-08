export interface ArtifactData {
  id: string;
  content: string;
  mimeType: string;
  title: string;
  timestamp: Date;
  size: number;
}

export interface ArtifactSystemState {
  currentArtifact: ArtifactData | null;
  isDrawerOpen: boolean;
  isFullscreen: boolean;
}

export type ArtifactTab = 'code' | 'preview';