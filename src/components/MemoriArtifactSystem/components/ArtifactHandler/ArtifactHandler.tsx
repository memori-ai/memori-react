/**
 * ArtifactHandler Component
 * Creates artifact handlers in chat messages and manages artifact display
 * Following the project's component patterns and design system
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { ArtifactData, ArtifactHandlerProps } from '../../types/artifact.types';
import { useArtifactCreator, useArtifactProcessor, useArtifactDetector } from '../../hooks/useArtifactSystem';

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  artifact,
  artifacts,
  customTitle,
  config,
  actions,
  message,
  onArtifactCreated,
}) => {
  const { t } = useTranslation();
  const { createArtifact } = useArtifactCreator();
  const { processArtifactContent } = useArtifactProcessor();
  const { hasArtifacts } = useArtifactDetector();

  /**
   * Format file size
   */
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  /**
   * Format timestamp
   */
  const formatTimestamp = useCallback((timestamp: Date): string => {
    return timestamp?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  /**
   * Handle artifact click
   */
  const handleArtifactClick = useCallback(() => {
    const artifactData = artifact;

    if (onArtifactCreated) {
      onArtifactCreated(artifactData!);
    }
  }, [artifact, onArtifactCreated]);

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
            messageID: (message as any).timestamp || `msg-${Date.now()}`,
            timestamp: new Date(),
            size: content.length,
          };

          // Add the new artifact to the artifact system state
          actions.addArtifact(artifact as ArtifactData);

          // If auto-open is enabled in config,
          // select/open the artifact after a short delay
          if (config.autoOpenArtifacts) {
            setTimeout(() => {
              actions.selectArtifact(artifact as ArtifactData);
            }, 500);
          }

          // Call the onArtifactCreated callback if provided
          if (onArtifactCreated) {
            onArtifactCreated(artifact as ArtifactData);
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

  // Check if this message contains artifacts
  const messageText = message.translatedText || message.text || '';
  const messageHasArtifacts = useMemo(() => hasArtifacts(messageText), [messageText]);

  // Only render if the message contains artifacts
  if (!messageHasArtifacts) {
    return null;
  }

  // If we have artifacts for this message, render them
  if (artifacts && artifacts.length > 0) {
    return (
      <div className="memori-artifact-handler-container">
        {artifacts.map((messageArtifact) => (
          <div
            key={messageArtifact.id}
            className={cx('memori-artifact-handler', 'memori-card', {
              'memori-artifact-handler-active': messageArtifact.isActive,
            })}
            onClick={() => {
              actions.selectArtifact(messageArtifact);
              if (onArtifactCreated) {
                onArtifactCreated(messageArtifact);
              }
            }}
          >
            <div className="memori-artifact-handler-content">
              <div className="memori-artifact-handler-icon">
                {messageArtifact.typeInfo?.icon || '📄'}
              </div>

              <div className="memori-artifact-handler-info">
                <div className="memori-artifact-handler-title">
                  {messageArtifact.title}
                </div>

                <div className="memori-artifact-handler-subtitle">
                  {t('artifact.generatedAt', 'Generated at')}{' '}
                  {formatTimestamp(messageArtifact.timestamp)} •{' '}
                  {formatBytes(messageArtifact.size)}
                </div>

                <div className="memori-artifact-handler-meta">
                  <span className="memori-artifact-handler-type">
                    {messageArtifact.typeInfo?.name || 'Text'}
                  </span>
                  {messageArtifact.customTitle && (
                    <span className="memori-artifact-handler-custom-title">
                      {messageArtifact.customTitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="memori-artifact-handler-actions">
                <button
                  className="memori-artifact-handler-toggle"
                  title={t('artifact.open', 'Open artifact') || 'Open artifact'}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M9 9l6 6m0-6l-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If we have a single artifact prop, render it (legacy support)
  if (artifact) {
    return (
      <div
        className={cx('memori-artifact-handler', 'memori-card')}
        onClick={handleArtifactClick}
      >
        <div className="memori-artifact-handler-content">
          <div className="memori-artifact-handler-icon">
            {artifact.typeInfo?.icon || '📄'}
          </div>

          <div className="memori-artifact-handler-info">
            <div className="memori-artifact-handler-title">{artifact.title}</div>

            <div className="memori-artifact-handler-subtitle">
              {t('artifact.generatedAt', 'Generated at')}{' '}
              {formatTimestamp(artifact.timestamp)} •{' '}
              {formatBytes(artifact.size)}
            </div>

            <div className="memori-artifact-handler-meta">
              <span className="memori-artifact-handler-type">
                {artifact.typeInfo?.name || 'Text'}
              </span>
              {customTitle && (
                <span className="memori-artifact-handler-custom-title">
                  {customTitle}
                </span>
              )}
            </div>
          </div>

          <div className="memori-artifact-handler-actions">
            <button
              className="memori-artifact-handler-toggle"
              title={t('artifact.open', 'Open artifact') || 'Open artifact'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 9l6 6m0-6l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no artifacts to display, return null
  return null;
};

export default ArtifactHandler;
