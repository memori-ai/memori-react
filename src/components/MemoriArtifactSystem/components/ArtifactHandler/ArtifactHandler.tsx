import React from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';

interface ArtifactHandlerProps {
  artifacts: ArtifactData[];
  isChatlogPanel?: boolean;
}

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  artifacts,
  isChatlogPanel = false,
}) => {
  const { openArtifact, state, closeArtifact } = useArtifact();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {artifacts.map(artifact => (
        <div
          key={artifact.id}
          className="memori-artifact-handler"
          onClick={() => {
            if (state.isDrawerOpen ) {
              closeArtifact();
            } else {
              openArtifact(artifact);
            }
          }}
        >
          <div className="memori-artifact-handler-icon">📄</div>
          <div className="memori-artifact-handler-info">
            <div className="memori-artifact-handler-title">
              {artifact.title}
            </div>
            <div className="memori-artifact-handler-meta">
              {artifact.mimeType} • {formatBytes(artifact.size)}
            </div>
          </div>
          <div className="memori-artifact-handler-action">
            {isChatlogPanel ? (
              state.isDrawerOpen ? (
                <ChevronUp className="memori-artifact-handler-action-icon" />
              ) : (
                <ChevronDown className="memori-artifact-handler-action-icon" />
              )
            ) : state.isDrawerOpen ? (
              <ChevronLeft className="memori-artifact-handler-action-icon" />
            ) : (
              <ChevronRight className="memori-artifact-handler-action-icon" />
            )}
          </div>
        </div>
      ))}

      {/* Render ArtifactDrawer inline when in chatlog panel */}
      {isChatlogPanel && state.isDrawerOpen && (
        <ArtifactDrawer isChatLogPanel={isChatlogPanel} />
      )}
    </div>
  );
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ArtifactHandler;
