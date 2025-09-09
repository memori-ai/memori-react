import React from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ArrowUp from '../../../icons/ArrowUp';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';

interface ArtifactHandlerProps {
  message: {
    text: string;
    translatedText?: string;
    fromUser: boolean;
    timestamp: string;
  };
  isChatlogPanel?: boolean;
}

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  message,
  isChatlogPanel = false,
}) => {
  const { openArtifact, state, closeArtifact } = useArtifact();

  // Simple artifact detection - look for <output class="memori-artifact"> tags
  const detectArtifacts = (text: string): ArtifactData[] => {
    if (!text || message.fromUser) return [];

    const artifactRegex =
      /<output\s+class="memori-artifact"[^>]*data-mimetype="([^"]+)"[^>]*>([\s\S]*?)<\/output>/gi;
    const artifacts: ArtifactData[] = [];
    let match;

    while ((match = artifactRegex.exec(text)) !== null) {
      const mimeType = match[1];
      const content = match[2].trim();

      if (content.length > 50) {
        // Basic validation
        artifacts.push({
          id: `artifact-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          content,
          mimeType,
          title: `${mimeType.toUpperCase()} Artifact`,
          timestamp: new Date(),
          size: content.length,
        });
      }
    }

    return artifacts;
  };

  const messageText = message.translatedText || message.text || '';
  const artifacts = detectArtifacts(messageText);

  if (artifacts.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {artifacts.map(artifact => (
        <div
          key={artifact.id}
          className="memori-artifact-handler"
          onClick={() => {
            if (state.isDrawerOpen) {
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
