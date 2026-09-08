import { ReactNode } from 'react';
import { ArtifactData, ArtifactEdit, ArtifactSystemState, ApplyUpdateResult } from '../types/artifact.types';
interface ArtifactContextType {
    state: ArtifactSystemState;
    openArtifact: (artifact: ArtifactData) => void;
    closeArtifact: () => void;
    toggleFullscreen: () => void;
    registerArtifact: (artifact: ArtifactData) => void;
    applyArtifactUpdate: (artifactId: string, edits: ArtifactEdit[]) => ApplyUpdateResult;
}
export declare const ArtifactProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useArtifact: () => ArtifactContextType;
export {};
