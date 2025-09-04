/**
 * MemoriArtifactSystem Component
 * Main component that integrates the entire artifact system
 * Following the project's component patterns and design system
 */

import React, { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ArtifactDrawer from './components/ArtifactDrawer/ArtifactDrawer';
import ArtifactHandler from './components/ArtifactHandler/ArtifactHandler';
import {
  useArtifactSystem,
  useArtifactProcessor,
} from './hooks/useArtifactSystem';
import {
  ArtifactSystemActions,
  ArtifactSystemConfig,
  ArtifactSystemState,
  MemoriNewDialogStateEvent,
} from './types/artifact.types';

// Import CSS files
import { Message } from '@memori.ai/memori-api-client/dist/types';

export interface MemoriArtifactSystemProps {
  config: ArtifactSystemConfig;
  onArtifactCreated?: (artifact: any) => void;
  className?: string;
  message: Message;
}

const MemoriArtifactSystem: React.FC<MemoriArtifactSystemProps> = ({
  config,
  onArtifactCreated,
  message,
  className,
}) => {
  const { state, actions } = useArtifactSystem(config);
  const { processArtifactContent } = useArtifactProcessor();

  /**
   * Process new dialog state for artifacts
   */
  useEffect(() => {
    const handleMemoriNewDialogState = (message: string) => {
      if (!message || typeof message !== 'string') return;
      console.log('🎨 Processing message for artifacts...');

      // controllo
      // Process the message content to find and handle any artifacts
      // processArtifactContent returns true if artifacts were found and processed
      const processed = processArtifactContent(
        message, // The message text to scan for artifacts
        (content, mimeType, title) => {
          // Callback when artifact is found

          // Create a new artifact object with:
          // - Unique ID combining type, timestamp and random string
          // - Content and metadata from the artifact
          // - Type info from config or default fallback
          // - Generated or custom title
          // - Creation timestamp and size
          const artifact = {
            // Generate unique ID
            id: `artifact-${mimeType}-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            content, // The artifact content
            mimeType: mimeType as any,
            // Get type info from config or use default
            typeInfo: config.supportedMimeTypes?.[
              mimeType as keyof typeof config.supportedMimeTypes
            ] || {
              name: mimeType.toUpperCase(),
              icon: '📄',
              hasPreview: false,
              language: 'text',
              mimeType: 'text/plain',
            },
            // Use provided title or generate one from type info
            title:
              title ||
              `${
                config.supportedMimeTypes?.[
                  mimeType as keyof typeof config.supportedMimeTypes
                ]?.icon || '📄'
              } ${
                config.supportedMimeTypes?.[
                  mimeType as keyof typeof config.supportedMimeTypes
                ]?.name || mimeType.toUpperCase()
              } Artifact`,
            customTitle: title,
            timestamp: new Date(),
            size: content.length,
          };

          // Add the new artifact to the artifact system state
          actions.addArtifact(artifact);

          // If auto-open is enabled in config,
          // select/open the artifact after a short delay
          if (config.autoOpenArtifacts) {
            setTimeout(() => {
              actions.selectArtifact(artifact);
            }, 500);
          }

          // Call the onArtifactCreated callback if provided
          if (onArtifactCreated) {
            onArtifactCreated(artifact);
          }
        }
      );

      if (processed) {
        console.log('✅ Artifacts processed successfully');
      }
    };
    if (!message.fromUser) {
      handleMemoriNewDialogState(message.translatedText || message.text);
    }
  }, [message]);

  return (
    <div className={className}>
      <ArtifactDrawer
        open={state.isDrawerOpen}
        onClose={actions.closeDrawer}
        artifact={state.currentArtifact}
        history={state.history}
        onSelectArtifact={actions.selectArtifact}
        onToggleFullscreen={actions.toggleFullscreen}
        isFullscreen={state.isFullscreen}
      />
      {state.history.map(artifact => (
        <ArtifactHandler
          onArtifactCreated={artifact => {
            actions.selectArtifact(artifact);
          }}
          key={artifact.id}
          artifact={artifact}
          content={artifact.content}
          mimeType={artifact.mimeType}
        />
      ))}
    </div>
  );
};

export default MemoriArtifactSystem;
