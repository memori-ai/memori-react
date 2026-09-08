import { ArtifactEdit } from '../types/artifact.types';
export interface ApplyEditsResult {
    content: string;
    failedEdits: ArtifactEdit[];
    appliedCount: number;
}
export declare const applyEdits: (content: string, edits: ArtifactEdit[]) => ApplyEditsResult;
export declare const parseEdits: (body: string) => ArtifactEdit[] | null;
