import React, { useEffect, useState } from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';
import { Message } from '@memori.ai/memori-api-client/dist/types';

interface ArtifactHandlerProps {
  isChatlogPanel?: boolean;
  message: Message;
}

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  isChatlogPanel = false,
  message,
}) => {
  const { openArtifact, state, closeArtifact } = useArtifact();
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(
    null
  );

  // Auto-open artifacts when detected in new messages
  useEffect(() => {
    const messageText = message.translatedText || message.text || '';
    if (!state.isDrawerOpen && messageText.length > 0) {
      const artifacts = detectArtifacts(messageText);

      if (artifacts.length > 0) {
        setTimeout(() => {
          openArtifact(artifacts[0]);
          setCurrentArtifact(artifacts[0]);
        }, 100);
      }
    }
  }, [message]);

  // Simple artifact detection - look for <output class="memori-artifact"> tags
  const detectArtifacts = (text: string): ArtifactData[] => {
    if (!text || message.fromUser) return [];

    const artifactRegex =
      /<output\s+class="memori-artifact"[^>]*data-mimetype="([^"]+)"[^>]*>([\s\S]*?)<\/output>/gi;
    const artifacts: ArtifactData[] = [];
    let match;
    const titleRegex = {
      dataTitle: /data-title\s*=\s*["\']([^"']+)["\']/i,
      htmlTitle: /<title>([^<]+)<\/title>/gi
    };
    const findTitle = (mimeType: string, content: string) => {
      return titleRegex.dataTitle.exec(content)?.[1] || titleRegex.htmlTitle.exec(content)?.[1] || `${mimeType.toUpperCase()} Artifact`;
    };
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
          title: findTitle(mimeType, text),          timestamp: new Date(),
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
      <div
        key={currentArtifact?.id}
        className="memori-artifact-handler"
        onClick={() => {
          if (
            state.isDrawerOpen &&
            state.currentArtifact?.id === currentArtifact?.id
          ) {
            closeArtifact();
          } else {
            openArtifact(currentArtifact as ArtifactData);
          }
        }}
      >
        <div className="memori-artifact-handler-icon">📄</div>
        <div className="memori-artifact-handler-info">
          <div className="memori-artifact-handler-title">
            {currentArtifact?.title}
          </div>
          <div className="memori-artifact-handler-meta">
            {currentArtifact?.mimeType} •{' '}
            {formatBytes(currentArtifact?.size || 0)}
          </div>
        </div>
        <div className="memori-artifact-handler-action">
          {isChatlogPanel ? (
            state.isDrawerOpen &&
            state.currentArtifact?.id === currentArtifact?.id ? (
              <ChevronUp className="memori-artifact-handler-action-icon" />
            ) : (
              <ChevronDown className="memori-artifact-handler-action-icon" />
            )
          ) : state.isDrawerOpen &&
            state.currentArtifact?.id === currentArtifact?.id ? (
            <ChevronLeft className="memori-artifact-handler-action-icon" />
          ) : (
            <ChevronRight className="memori-artifact-handler-action-icon" />
          )}
        </div>
      </div>

      {/* Render ArtifactDrawer inline when in chatlog panel */}
      {state.isDrawerOpen &&
        state.currentArtifact?.id === currentArtifact?.id && (
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
