import React from 'react';
import { ArtifactData } from '../../types/artifact.types';
declare const ArtifactActions: React.FC<{
    artifact: ArtifactData;
    onCopy: () => void;
    onDownload?: () => void;
    onPrint?: () => void;
    onOpenExternal?: () => void;
    loading: boolean;
    isMobile?: boolean;
}>;
export default ArtifactActions;
