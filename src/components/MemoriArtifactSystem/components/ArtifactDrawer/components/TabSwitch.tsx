/**
 * TabSwitch Component
 * Modern animated switch for toggling between code and preview tabs
 */

import React from 'react';
import { ArtifactTab } from '../../../types/artifact.types';
import cx from 'classnames';
import Code from '../../../../icons/Code';
import { PreviewIcon } from '../../../../icons/Preview';

interface TabSwitchProps {
  activeTab: ArtifactTab;
  onTabChange: (tab: ArtifactTab) => void;
  hasPreview: boolean;
}

const TabSwitch: React.FC<TabSwitchProps> = ({
  activeTab,
  onTabChange,
  hasPreview,
}) => {
  const tabs = [
    {
      id: 'code' as ArtifactTab,
      icon: Code,
    //   label: 'Code',
    },
    ...(hasPreview
      ? [
          {
            id: 'preview' as ArtifactTab,
            icon: PreviewIcon,
            // label: 'Preview',
          },
        ]
      : []),
  ];

  return (
    <div className="memori-tab-switch">
      <div className="memori-tab-switch__container">
        <div
          className="memori-tab-switch__track"
          style={{
            '--tab-count': tabs.length,
          } as React.CSSProperties}
        >
          <div
            className="memori-tab-switch__indicator"
            style={{
              '--active-index': tabs.findIndex(tab => tab.id === activeTab),
            } as React.CSSProperties}
          />
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={cx('memori-tab-switch__button', {
                  'memori-tab-switch__button--active': activeTab === tab.id,
                })}
                onClick={() => onTabChange(tab.id)}
                aria-pressed={activeTab === tab.id}
                // title={tab.label}
              >
                <IconComponent className="memori-tab-switch__icon" />
                {/* <span className="memori-tab-switch__label">{tab.label}</span> */}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabSwitch;
