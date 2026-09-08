import React from 'react';
import { ArtifactData, ArtifactTab } from '../../types/artifact.types';
declare const ArtifactPreview: React.FC<{
    artifact: ArtifactData;
    activeTab: ArtifactTab;
}>;
export default ArtifactPreview;
