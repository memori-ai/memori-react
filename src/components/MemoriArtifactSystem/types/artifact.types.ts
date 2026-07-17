export interface ArtifactData {
  /** Unique UI identifier for this version instance */
  id: string;
  /** Stable lineage id (from data-artifact-id); constant across versions */
  artifactId: string;
  content: string;
  mimeType: string;
  title: string;
  timestamp: Date;
  size: number;
}

export interface ArtifactEdit {
  /** Exact string to find and replace (first occurrence) */
  old: string;
  /** Replacement string */
  new: string;
}

export interface ApplyUpdateResult {
  success: boolean;
  failedEdits: ArtifactEdit[];
  updatedArtifact: ArtifactData | null;
}

export interface ArtifactSystemState {
  currentArtifact: ArtifactData | null;
  isDrawerOpen: boolean;
  isFullscreen: boolean;
}

export type ArtifactTab = 'code' | 'preview';
