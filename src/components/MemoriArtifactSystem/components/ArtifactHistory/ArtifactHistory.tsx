/**
 * ArtifactHistory Component
 * Displays a list of artifact history entries with selection and management
 * Following the project's component patterns and design system
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import { ArtifactHistoryProps, ArtifactData } from '../../types/artifact.types';
import Close from '../../../icons/Close';
import Clear from '../../../icons/Clear';
import ArrowUp from '../../../icons/ArrowUp';

const ArtifactHistory: React.FC<ArtifactHistoryProps> = ({
  history,
  onSelectArtifact,
  onClearHistory,
  maxItems = 50,
}) => {
  const { t } = useTranslation();

  /**
   * Format file size in human readable format
   */
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  /**
   * Format timestamp for display
   */
  const formatTimestamp = useCallback((timestamp: Date): string => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  /**
   * Handle artifact selection
   */
  const handleSelectArtifact = useCallback((artifact: ArtifactData) => {
    onSelectArtifact(artifact);
  }, [onSelectArtifact]);

  /**
   * Handle clear history
   */
  const handleClearHistory = useCallback(() => {
    if (onClearHistory && window.confirm(t('artifact.clearHistoryConfirm', 'Are you sure you want to clear all artifact history?') || 'Are you sure you want to clear all artifact history?')) {
      onClearHistory();
    }
  }, [onClearHistory, t]);

  /**
   * Get limited history items
   */
  const limitedHistory = useMemo(() => {
    return history.slice(0, maxItems);
  }, [history, maxItems]);

  /**
   * Check if there are more items than the limit
   */
  const hasMoreItems = useMemo(() => {
    return history.length > maxItems;
  }, [history.length, maxItems]);

  if (history.length === 0) {
    return (
      <div className="memori-artifact-history">
        <div className="memori-artifact-history-header">
          <h3 className="memori-artifact-history-title">
            {t('artifact.history', 'Artifact History')}
          </h3>
        </div>
        <div className="memori-artifact-history-empty">
          <div className="memori-artifact-history-empty-icon">📄</div>
          <p className="memori-artifact-history-empty-text">
            {t('artifact.noHistory', 'No artifacts yet')}
          </p>
          <p className="memori-artifact-history-empty-subtext">
            {t('artifact.noHistorySubtext', 'Artifacts will appear here when generated')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="memori-artifact-history">
      <div className="memori-artifact-history-header">
        <h3 className="memori-artifact-history-title">
          {t('artifact.history', 'Artifact History')}
        </h3>
        <div className="memori-artifact-history-actions">
          {onClearHistory && (
            <Button
              onClick={handleClearHistory}
              className="memori-artifact-history-clear-btn"
              ghost
              title={t('artifact.clearHistory', 'Clear history') || 'Clear history'}
            >
              <Clear className="memori-artifact-history-clear-btn-icon" />
            </Button>
          )}
        </div>
      </div>

      <div className="memori-artifact-history-list">
        {limitedHistory.map((artifact) => (
          <div
            key={artifact.id}
            className={cx('memori-artifact-history-item', {
              'memori-artifact-history-item--active': artifact.isActive,
            })}
            onClick={() => handleSelectArtifact(artifact)}
          >
            <div className="memori-artifact-history-item-content">
              <div className="memori-artifact-history-item-icon">
                {artifact.typeInfo.icon}
              </div>
              
              <div className="memori-artifact-history-item-info">
                <div className="memori-artifact-history-item-title">
                  {artifact.title}
                </div>
                <div className="memori-artifact-history-item-subtitle">
                  {t('artifact.generatedAt', 'Generated at')} {formatTimestamp(artifact.timestamp)} • {formatBytes(artifact.size)}
                </div>
                <div className="memori-artifact-history-item-meta">
                  <span className="memori-artifact-history-item-type">
                    {artifact.typeInfo.name}
                  </span>
                  {artifact.customTitle && (
                    <span className="memori-artifact-history-item-custom-title">
                      {artifact.customTitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="memori-artifact-history-item-actions">
                <Button
                  className="memori-artifact-history-item-toggle"
                  ghost
                  title={artifact.isActive ? (t('artifact.close', 'Close') || 'Close') : (t('artifact.open', 'Open') || 'Open')}
                >
                  {artifact.isActive ? (
                    <Close className="memori-artifact-history-item-toggle-icon" />
                  ) : (
                    <ArrowUp className="memori-artifact-history-item-toggle-icon" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {hasMoreItems && (
          <div className="memori-artifact-history-more">
            <p className="memori-artifact-history-more-text">
              {t('artifact.moreItems', `+${history.length - maxItems} more items`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactHistory;
