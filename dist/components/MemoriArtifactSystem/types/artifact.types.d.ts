export interface ArtifactData {
    id: string;
    artifactId: string;
    content: string;
    mimeType: string;
    title: string;
    timestamp: Date;
    size: number;
}
export interface ArtifactEdit {
    old: string;
    new: string;
}
export interface ApplyUpdateResult {
    success: boolean;
    failedEdits: ArtifactEdit[];
    updatedArtifact: ArtifactData | null;
    failureReason?: 'not-found' | 'no-match';
}
export interface ArtifactSystemState {
    currentArtifact: ArtifactData | null;
    isDrawerOpen: boolean;
    isFullscreen: boolean;
}
export type ArtifactTab = 'code' | 'preview';
