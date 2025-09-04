/**
 * ArtifactHandler Component
 * Creates artifact handlers in chat messages and manages artifact display
 * Following the project's component patterns and design system
 */

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { ArtifactHandlerProps } from '../../types/artifact.types';
import { useArtifactCreator } from '../../hooks/useArtifactSystem';

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  artifact,
  customTitle,
  onArtifactCreated,
}) => {
  const { t } = useTranslation();
  const { createArtifact } = useArtifactCreator();

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
    
    // Dispatch custom event for artifact selection
    const event = new CustomEvent('memori-artifact-selected', {
      detail: { artifact: artifactData },
    });
    document.dispatchEvent(event);
    
    if (onArtifactCreated) {
      onArtifactCreated(artifactData!);
    }
  }, [artifact, onArtifactCreated]);

  return (
    <div 
      className={cx("memori-artifact-handler", "memori-card")}
      onClick={handleArtifactClick}
    >
      <div className="memori-artifact-handler-content">
        <div className="memori-artifact-handler-icon">
          {artifact?.typeInfo?.icon || '📄'}
        </div>
        
        <div className="memori-artifact-handler-info">
          <div className="memori-artifact-handler-title">
            {artifact?.title}
          </div>
          
          <div className="memori-artifact-handler-subtitle">
            {t('artifact.generatedAt', 'Generated at')} {formatTimestamp(artifact?.timestamp || new Date())} • {formatBytes(artifact?.size || 0)}
          </div>
          
          <div className="memori-artifact-handler-meta">
            <span className="memori-artifact-handler-type">
              {artifact?.typeInfo?.name || 'Text'}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 9l6 6m0-6l-6 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtifactHandler;
