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
  /** True when the open artifact is shown inline in the chat (not the side drawer). */
  isChatLogPanelPresentation: boolean;
}

export type ArtifactTab = 'code' | 'preview';