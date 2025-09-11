/**
 * CopyMenuItem component for dropdown menu items
 * Supports different action types with appropriate icons and loading states
 */

import React from 'react';
import cx from 'classnames';
import { CopyMenuItemProps } from '../types';
import Copy from '../../../../icons/Copy';
import Download from '../../../../icons/Download';
import PrintIcon from '../../../../icons/Print';

const CopyMenuItem: React.FC<CopyMenuItemProps & { active?: boolean }> = ({
  format,
  onClick,
  loading = false,
  disabled = false,
  active = false,
}) => {
  const handleClick = () => {
    if (!disabled && !loading) {
      onClick(format);
    }
  };

  const getIcon = () => {
    if (loading) {
      return (
        <div className="memori-copy-menu-item-loading">
          <div className="memori-copy-menu-item-spinner" />
        </div>
      );
    }

    switch (format.action) {
      case 'pdf':
        return <Download className="memori-copy-menu-item-icon" />;
      case 'print':
        return <PrintIcon className="memori-copy-menu-item-icon" />;
      default:
        return <Copy className="memori-copy-menu-item-icon" />;
    }
  };

  return (
    <button
      type="button"
      className={cx('memori-copy-menu-item', {
        'memori-copy-menu-item--loading': loading,
        'memori-copy-menu-item--disabled': disabled,
        'memori-copy-menu-item--pdf': format.action === 'pdf',
        'memori-copy-menu-item--print': format.action === 'print',
        'memori-copy-menu-item--active': active,
      })}
      onClick={handleClick}
      disabled={disabled || loading}
      title={format.description}
    >
      <div className="memori-copy-menu-item-content">
        <div className="memori-copy-menu-item-icon-wrapper">
          {getIcon()}
        </div>
        <div className="memori-copy-menu-item-text">
          <div className="memori-copy-menu-item-label">
            {format.label}
          </div>
          {format.description && (
            <div className="memori-copy-menu-item-description">
              {format.description}
            </div>
          )}
        </div>
        {format.isAsync && (
          <div className="memori-copy-menu-item-async-indicator">
            <span className="memori-copy-menu-item-async-badge">PDF</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default CopyMenuItem;
