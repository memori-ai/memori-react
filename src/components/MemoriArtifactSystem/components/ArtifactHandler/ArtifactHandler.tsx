import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { stripOutputTags, stripReasoningTags } from '../../../../helpers/utils';

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
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(
    null
  );

  // Memoize the message text to prevent unnecessary recalculations
  const messageText = useMemo(() => {
    return message.translatedText || message.text || '';
  }, [message.translatedText, message.text]);

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

    //first strip the output tag isnide the think tag, if there is one
    text = stripReasoningTags(text);

    const artifacts: ArtifactData[] = [];
    
    // Find complete opening and closing tags
    const artifactRegex = /<output\s+class="memori-artifact"[^>]*data-mimetype="([^"]+)"[^>]*>([\s\S]*?)<\/output>/gi;
    const titleRegex = {
      dataTitle: /data-title\s*=\s*["\']([^"']+)["\']/i,
      htmlTitle: /<title>([^<]+)<\/title>/gi
    };

    const findTitle = (mimeType: string, content: string) => {
      return titleRegex.dataTitle.exec(content)?.[1] || titleRegex.htmlTitle.exec(content)?.[1] || `${mimeType.toUpperCase()} Artifact`;
    };

    let match;
    while ((match = artifactRegex.exec(text)) !== null) {
      const mimeType = match[1];
      const content = match[2].trim();

      if (content.length > 50) {
        const artifact = {
          id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          mimeType,
          title: findTitle(mimeType, text),
          timestamp: new Date(),
          size: content.length,
        };

        artifacts.push(artifact);
      }
    }

    return artifacts;
  }, []); // Remove message dependency

  // Memoize artifacts detection to prevent recalculation on every render
  const artifacts = useMemo(() => {
    return detectArtifacts(messageText, message.fromUser || false);
  }, [messageText, message.fromUser, detectArtifacts]);

  // Auto-open artifacts when detected in new messages
  // Only run when messageId changes (actual new message), not on every render
  useEffect(() => {
    if (messageText.length > 0 && artifacts.length > 0) {
      // Dispatch event for each artifact created
      artifacts.forEach(artifact => {
        dispatchArtifactCreatedEvent(artifact);
      });

      if(isChatlogPanel){
        // openArtifact(artifacts[0]);
        setCurrentArtifact(artifacts[0]);
      } else {
        setTimeout(() => {
          openArtifact(artifacts[0]);
          setCurrentArtifact(artifacts[0]);
        }, 100);
      }
    }
  }, [messageId, artifacts, dispatchArtifactCreatedEvent, isChatlogPanel, openArtifact]);

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
