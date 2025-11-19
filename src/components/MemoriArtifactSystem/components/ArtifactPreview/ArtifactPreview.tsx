/**
 * ArtifactPreview Component
 * Displays artifact content with tabs for code and preview
 * Following the project's component patterns and design system
 */

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import { ArtifactData, ArtifactTab } from '../../types/artifact.types';
import Code from '../../../icons/Code';
import { PreviewIcon } from '../../../icons/Preview';
import Snippet from '../../../Snippet/Snippet';
import { Medium } from '@memori.ai/memori-api-client/dist/types';

const ArtifactPreview: React.FC<{
  artifact: ArtifactData;
  activeTab: ArtifactTab;
}> = ({ artifact, activeTab }) => {
  const { t } = useTranslation();

  /**
   * Render preview content based on MIME type
   */
  const renderPreview = useCallback(() => {
    switch (artifact.mimeType) {
      case 'html':
        return (
          <iframe
            className="memori-artifact-preview-iframe"
            srcDoc={artifact.content}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '6px',
            }}
            title={`${artifact.title} Preview`}
            scrolling="auto"
          />
        );

      case 'markdown':
        return (
          <div
            className="memori-artifact-preview-markdown"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(artifact.content),
            }}
          />
        );

      default:
        return null;
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
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\n/g, '<br>');
  }, []);

  const mapArtifactMimeTypeToSnippetMimeType = useCallback(
    (mimeType: string) => {
      switch (mimeType) {
        case 'javascript':
          return 'text/javascript';
        case 'typescript':
          return 'text/ecmascript';
        case 'html':
          return 'application/xml';
        case 'css':
          return 'text/css';
        case 'json':
          return 'application/json';
        case 'python':
          return 'text/x-python';
        case 'bash':
          return 'application/x-sh';
        case 'cpp':
        case 'csharp':
          return 'text/x-c++src';
        case 'php':
          return 'application/x-php';
        case 'sql':
          return 'text/x-sql';
        case 'ruby':
          return 'text/x-ruby';
        default:
          return 'text/plain';
      }
    },
    []
  );

  const hasPreview =
    artifact.mimeType === 'html' || artifact.mimeType === 'markdown';

  return (
    <div className="memori-artifact-preview">

      {/* Content */}
      <div className="memori-artifact-content">
        {/* Code Tab */}
        <div
          className={cx('memori-artifact-tab-content', {
            'memori-artifact-tab-content--active':
              activeTab === 'code' || !hasPreview,
          })}
        >
          <div className="memori-artifact-code">
            <Snippet
              showCopyButton={false}
              medium={
                {
                  mediumID: artifact.id,
                  mimeType: mapArtifactMimeTypeToSnippetMimeType(
                    artifact.mimeType
                  ),
                  content: artifact.content,
                  title: artifact.title,
                  creationTimestamp: artifact.timestamp.toISOString(),
                  creationName: 'System',
                  lastChangeTimestamp: artifact.timestamp.toISOString(),
                  lastChangeName: 'System',
                } as Medium
              }
            />
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
