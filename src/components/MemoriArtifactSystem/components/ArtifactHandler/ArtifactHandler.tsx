import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { stripReasoningTags } from '../../../../helpers/utils';

// Event type for artifact creation
type ArtifactCreatedEvent = CustomEvent<{
  artifact: ArtifactData;
  message: Message;
}>;

interface ArtifactHandlerProps {
  isChatlogPanel?: boolean;
  message: Message;
}

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  isChatlogPanel = false,
  message,
}) => {
  const { openArtifact, state, closeArtifact } = useArtifact();

  // Use raw text for artifact detection. translatedText may lose <output> tags.
  const messageText = useMemo(() => {
    return message.text || '';
  }, [message.text]);

  // Keep translated text as fallback only when raw text is missing.
  const translatedMessageText = useMemo(() => {
    return message.translatedText || '';
  }, [message.translatedText]);

  // Memoize the message ID to track when the actual message changes
  const messageId = useMemo(() => {
    return `${message.timestamp}-${message.fromUser}`;
  }, [message.timestamp, message.fromUser]);

  // Function to dispatch artifact created event
  const dispatchArtifactCreatedEvent = useCallback((artifact: ArtifactData) => {
    const event: ArtifactCreatedEvent = new CustomEvent('artifactCreated', {
      detail: {
        artifact,
        message,
      },
    });
    document.dispatchEvent(event);
  }, [message]);

  // Simple artifact detection - look for <output class="memori-artifact"> tags
  // Remove message dependency to prevent recreation on every message change
  const detectArtifacts = useCallback((text: string, isFromUser: boolean): ArtifactData[] => {
    if (!text || isFromUser) {
      return [];
    }

    text = stripReasoningTags(text);

    const artifacts: ArtifactData[] = [];
    
    // Match artifact output blocks regardless of attribute order.
    // We parse data-mimetype from the opening tag separately.
    const artifactRegex = /(<output\b[^>]*class\s*=\s*["']memori-artifact["'][^>]*>)([\s\S]*?)(?:<\/output>|$)/gi;
    const titleRegex = {
      dataTitle: /data-title\s*=\s*["\']([^"']+)["\']/i,
      htmlTitle: /<title>([^<]+)<\/title>/gi
    };

    const findTitle = (mimeType: string, content: string, outputTag: string) => {
      // First try to find data-title in the output tag
      const dataTitleMatch = outputTag.match(/data-title\s*=\s*["\']([^"']+)["\']/i);
      if (dataTitleMatch) {
        return dataTitleMatch[1];
      }
      
      // Then try to find title in the content
      const htmlTitleMatch = content.match(/<title>([^<]+)<\/title>/i);
      if (htmlTitleMatch) {
        return htmlTitleMatch[1];
      }
      
      // Default title based on mimeType
      return `${mimeType.toUpperCase()} Artifact`;
    };

    let match;
    let artifactNum = 0;
    while ((match = artifactRegex.exec(text)) !== null) {
      artifactNum++;
      const outputTag = match[1]; // Opening output tag for metadata extraction
      const content = match[2].trim();
      const mimeTypeMatch = outputTag.match(/data-mimetype\s*=\s*["']([^"']+)["']/i);
      const mimeType = mimeTypeMatch?.[1]?.trim() || 'text/plain';
      
      const artifact = {
        id: `artifact-${Date.now()}-${artifactNum}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        mimeType,
        title: findTitle(mimeType, content, outputTag),
        timestamp: new Date(),
        size: content.length,
      };
      artifacts.push(artifact);
    }

    return artifacts;
  }, []); // Remove message dependency

  // Memoize artifacts detection to prevent recalculation on every render
  const artifacts = useMemo(() => {
    const fromUser = message.fromUser || false;
    const rawArtifacts = detectArtifacts(messageText, fromUser);
    if (rawArtifacts.length > 0) {
      return rawArtifacts;
    }
    // Fallback for legacy payloads where output tags might exist only in translated text.
    return detectArtifacts(translatedMessageText, fromUser);
  }, [messageText, translatedMessageText, message.fromUser, detectArtifacts]);

  // Auto-open first artifact when detected in new messages
  // Only run when messageId changes (actual new message), not on every render
  useEffect(() => {
    if (messageText.length > 0 && artifacts.length > 0) {
      // Dispatch event for each artifact created
      artifacts.forEach(artifact => {
        dispatchArtifactCreatedEvent(artifact);
      });

      // Only auto-open the first artifact
      if (!isChatlogPanel) {
        setTimeout(() => {
          openArtifact(artifacts[0]);
        }, 100);
      }
    }
  }, [messageId, artifacts, dispatchArtifactCreatedEvent, isChatlogPanel, openArtifact]);

  const handleArtifactClick = useCallback((artifact: ArtifactData) => {
    if (
      state.isDrawerOpen &&
      state.currentArtifact?.id === artifact.id
    ) {
      closeArtifact();
    } else {
      openArtifact(artifact);
    }
  }, [state.isDrawerOpen, state.currentArtifact?.id, closeArtifact, openArtifact]);

  const getIconForMimeType = useCallback((mimeType: string): string => {
    if (mimeType.includes('html')) return '🌐';
    if (mimeType.includes('markdown')) return '📝';
    if (mimeType.includes('javascript') || mimeType.includes('typescript')) return '📜';
    if (mimeType.includes('python')) return '🐍';
    if (mimeType.includes('json')) return '📊';
    if (mimeType.includes('css')) return '🎨';
    if (mimeType.includes('xml')) return '📋';
    if (mimeType.includes('svg')) return '🖼️';
    return '📄';
  }, []);

  if (artifacts.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {artifacts.map((artifact) => {
        const isSelected = state.isDrawerOpen && state.currentArtifact?.id === artifact.id;
        
        return (
          <React.Fragment key={artifact.id}>
            <div
              className={`memori-artifact-handler${isSelected ? ' memori-artifact-handler--selected' : ''}`}
              onClick={() => handleArtifactClick(artifact)}
              style={isSelected ? {
                border: '2px solid var(--memori-primary, #3b82f6)',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              } : undefined}
            >
            <div className="memori-artifact-handler-icon">
              {getIconForMimeType(artifact.mimeType)}
            </div>
            <div className="memori-artifact-handler-info">
              <div className="memori-artifact-handler-title">
                {artifact.title}
              </div>
              <div className="memori-artifact-handler-meta">
                {artifact.mimeType} •{' '}
                {formatBytes(artifact.size || 0)}
              </div>
            </div>
            <div className="memori-artifact-handler-action">
              {isChatlogPanel ? (
                state.isDrawerOpen &&
                state.currentArtifact?.id === artifact.id ? (
                  <ChevronUp className="memori-artifact-handler-action-icon" />
                ) : (
                  <ChevronDown className="memori-artifact-handler-action-icon" />
                )
              ) : state.isDrawerOpen &&
                state.currentArtifact?.id === artifact.id ? (
                <ChevronLeft className="memori-artifact-handler-action-icon" />
              ) : (
                <ChevronRight className="memori-artifact-handler-action-icon" />
              )}
            </div>
          </div>

          {/* Render ArtifactDrawer inline when in chatlog panel */}
          {state.isDrawerOpen &&
            state.currentArtifact?.id === artifact.id && (
              <ArtifactDrawer isChatLogPanel={isChatlogPanel} />
            )}
        </React.Fragment>
      );
      })}
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

// Memoize the component to prevent re-renders when props haven't changed
const MemoizedArtifactHandler = memo(ArtifactHandler, (prevProps, nextProps) => {
  // Only re-render if the message content or isChatlogPanel changes
  const prevMessageText = prevProps.message.translatedText || prevProps.message.text || '';
  const nextMessageText = nextProps.message.translatedText || nextProps.message.text || '';
  
  return (
    prevProps.isChatlogPanel === nextProps.isChatlogPanel &&
    prevMessageText === nextMessageText &&
    prevProps.message.fromUser === nextProps.message.fromUser &&
    prevProps.message.timestamp === nextProps.message.timestamp
  );
});

export default MemoizedArtifactHandler;
