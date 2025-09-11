/**
 * CopyButtonWithDropdown - Main component with dropdown menu
 * Similar to Claude's copy system with format-specific options using headless-ui
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Menu, Transition } from '@headlessui/react';
import cx from 'classnames';
import { CopyButtonWithDropdownProps, CopyFormat } from '../types';
import { useCopyArtifact } from '../hooks/useCopyArtifact';
import CopyMenuItem from './CopyMenuItem';
import Button from '../../../../ui/Button';
import Copy from '../../../../icons/Copy';
import ChevronDown from '../../../../icons/ChevronDown';
import ThumbUp from '../../../../icons/ThumbUp';
import Alert from '../../../../icons/Alert';

const CopyButtonWithDropdown: React.FC<CopyButtonWithDropdownProps> = ({
  artifact,
  onCopy,
  onDownload,
  onPrint,
  loading = false,
  className,
  disabled = false,
}) => {
  const { copyState, formats, handleCopy, handleCopyClick } = useCopyArtifact(
    artifact,
    onCopy,
    onDownload,
    onPrint
  );

  /**
   * Handle format selection from dropdown
   */
  const handleFormatSelect = async (format: typeof formats[0]) => {
    await handleCopy(format);
  };

  /**
   * Get button content based on state
   */
  const getButtonContent = () => {
    if (copyState.success) {
      return (
        <>
          <ThumbUp className="memori-copy-button-icon memori-copy-button-icon--success" />
          <span className="memori-copy-button-text">Copied!</span>
        </>
      );
    }

    if (copyState.error) {
      return (
        <>
          <Alert className="memori-copy-button-icon memori-copy-button-icon--error" />
          <span className="memori-copy-button-text">Error</span>
        </>
      );
    }

    if (copyState.loading) {
      return (
        <>
          <div className="memori-copy-button-loading">
            <div className="memori-copy-button-spinner" />
          </div>
          <span className="memori-copy-button-text">
            {copyState.activeFormat === 'pdf'
              ? 'Generating PDF...'
              : 'Copying...'}
          </span>
        </>
      );
    }

    return (
      <>
        <Copy className="memori-copy-button-icon" />
        <span className="memori-copy-button-text">Copy</span>
      </>
    );
  };

  /**
   * Get button title/tooltip
   */
  const getButtonTitle = () => {
    if (copyState.success) {
      return 'Copied successfully!';
    }

    if (copyState.error) {
      return `Error: ${copyState.error}`;
    }

    if (copyState.loading) {
      return copyState.activeFormat === 'pdf'
        ? 'Generating PDF...'
        : 'Copying...';
    }

    if (formats.length > 0) {
      return `Copy as ${formats[0].label}`;
    }

    return 'Copy';
  };

  return (
    <div className="memori-copy-button-wrapper">
      <div className="memori-copy-button-group">
        {/* Main copy button */}
        <Button
          onClick={handleCopyClick}
          disabled={disabled || loading || copyState.loading}
          className={cx(
            'memori-copy-button memori-copy-button--main',
            {
              'memori-copy-button--success': copyState.success,
              'memori-copy-button--error': copyState.error,
              'memori-copy-button--loading': copyState.loading,
            },
            className
          )}
          ghost
          title={getButtonTitle()}
        >
          {getButtonContent()}
        </Button>

        {/* Dropdown button (only show if multiple formats) */}
        {formats.length > 0 && (
          <Menu as="div" className="memori-copy-menu-wrapper">
            {() => (
              <>
                <Menu.Button as="div" className="memori-copy-button-trigger">
                  <Button
                    disabled={disabled || loading || copyState.loading}
                    className="memori-copy-button--dropdown"
                    ghost
                    title="More copy options"
                  >
                    <ChevronDown className="memori-copy-button-chevron" />
                  </Button>
                </Menu.Button>

                <Transition
                  as={React.Fragment}
                  enter="memori-copy-dropdown-enter"
                  enterFrom="memori-copy-dropdown-enter-from"
                  enterTo="memori-copy-dropdown-enter-to"
                  leave="memori-copy-dropdown-leave"
                  leaveFrom="memori-copy-dropdown-leave-from"
                  leaveTo="memori-copy-dropdown-leave-to"
                >
                  <Menu.Items className="memori-copy-dropdown">
                    <div className="memori-copy-dropdown-content">
                      <div className="memori-copy-dropdown-header">
                        <span className="memori-copy-dropdown-title">
                          Copy as
                        </span>
                      </div>

                      <div className="memori-copy-dropdown-list">
                        {formats.map(format => (
                          <Menu.Item key={format.id}>
                            {({ active }) => (
                              <CopyMenuItem
                                format={format}
                                onClick={handleFormatSelect}
                                loading={copyState.loading}
                                active={active}
                              />
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        )}
      </div>

    </div>
  );
};

export default CopyButtonWithDropdown;
