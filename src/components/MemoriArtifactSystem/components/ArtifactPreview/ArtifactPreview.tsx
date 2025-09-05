/**
 * ArtifactPreview Component
 * Displays artifact content with tabs for code and preview
 * Following the project's component patterns and design system
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import { ArtifactMimeType, ArtifactPreviewProps, ArtifactTab, SUPPORTED_MIME_TYPES } from '../../types/artifact.types';
import Code from '../../../icons/Code';
import { PreviewIcon } from '../../../icons/Preview';
import Snippet from '../../../Snippet/Snippet';
import { Medium } from '@memori.ai/memori-api-client/dist/types';

const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({
  artifact,
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();

  /**
   * Handle tab switching
   */
  const handleTabChange = useCallback((tab: ArtifactTab) => {
    onTabChange(tab);
  }, [onTabChange]);
  /**
   * Render preview content based on MIME type
   */
  const renderPreview = useCallback(() => {
    switch (artifact.mimeType) {
      case 'html':
        return (
          <iframe
            srcDoc={artifact.content}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '6px',
            }}
            title={`${artifact.title} Preview`}
          />
        );

      case 'markdown':
        return (
          <div 
            className="memori-artifact-preview-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(artifact.content) }}
          />
        );

      case 'svg':
        return (
          <div 
            className="memori-artifact-preview-svg"
            dangerouslySetInnerHTML={{ __html: artifact.content }}
          />
        );

      case 'css':
        return (
          <div className="memori-artifact-preview-css">
            <div className="memori-artifact-preview-css-demo">
              <style dangerouslySetInnerHTML={{ __html: artifact.content }} />
              <div className="memori-artifact-preview-css-content">
                <h3>CSS Preview</h3>
                <p>This is an example of text to see the CSS effect.</p>
                <button>Example Button</button>
                <div className="memori-artifact-preview-css-container">
                  Example Container
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="memori-artifact-preview-text">
            <pre>{artifact.content}</pre>
          </div>
        );
    }
  }, [artifact]);

  /**
   * Basic markdown rendering
   */
  const renderMarkdown = useCallback((markdown: string): string => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  }, []);

  /**
   * Check if preview is available for this artifact type
   */
  const hasPreview = useMemo(() => {
    return artifact.typeInfo.hasPreview;
  }, [artifact.typeInfo.hasPreview]);

  const mapArtifactMimeType = useCallback((mimeType: ArtifactMimeType) => {
    return SUPPORTED_MIME_TYPES[mimeType as keyof typeof SUPPORTED_MIME_TYPES].mimeType;
  }, []);

  return (
    <div className="memori-artifact-preview">
      {/* Tabs */}
      {hasPreview && (
        <div className="memori-artifact-tabs">
          <Button
            onClick={() => handleTabChange('code')}
            className={cx('memori-artifact-tab', {
              'memori-artifact-tab--active': activeTab === 'code',
            })}
            ghost
          >
           <Code className="memori-artifact-tab-icon" />
           <span className="memori-artifact-tab-text">{t('artifact.code', 'Code')}</span>
          </Button>
          <Button
            onClick={() => handleTabChange('preview')}
            className={cx('memori-artifact-tab', {
              'memori-artifact-tab--active': activeTab === 'preview',
            })}
            ghost
          >
            <PreviewIcon className="memori-artifact-tab-icon" />
            <span className="memori-artifact-tab-text">{t('artifact.preview', 'Preview')}</span>
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="memori-artifact-content">
        {/* Code Tab */}
        <div 
          className={cx('memori-artifact-tab-content', {
            'memori-artifact-tab-content--active': activeTab === 'code' || !hasPreview,
          })}
        >
          <div className="memori-artifact-code">
            <Snippet 
            // preview={true}
            medium={{
              mediumID: artifact.id,
              mimeType: mapArtifactMimeType(artifact.mimeType as ArtifactMimeType),
              content: artifact.content,
              title: artifact.title,
              creationTimestamp: artifact.timestamp.toISOString(),
              creationName: 'System',
              lastChangeTimestamp: artifact.timestamp.toISOString(),
              lastChangeName: 'System',
            } as Medium} />
          </div>
        </div>

        {/* Preview Tab */}
        {hasPreview && (
          <div 
            className={cx('memori-artifact-tab-content', {
              'memori-artifact-tab-content--active': activeTab === 'preview',
            })}
          >
            <div className="memori-artifact-preview-content">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactPreview;
