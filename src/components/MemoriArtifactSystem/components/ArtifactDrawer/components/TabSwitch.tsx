import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { ArtifactTab } from '../../../types/artifact.types';

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
  const { t } = useTranslation();

  if (!hasPreview) {
    return null;
  }

  const tabs: { id: ArtifactTab; label: string }[] = [
    {
      id: 'preview',
      label: t('artifact.preview') || 'Preview',
    },
    {
      id: 'code',
      label: t('artifact.source') || t('artifact.code') || 'Source',
    },
  ];

  return (
    <div
      className="memori-tab-switch"
      role="group"
      aria-label={t('artifact.viewMode') || 'View mode'}
    >
      {tabs.map(tab => {
        const pressed = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={cx('memori-tab-switch__tab', {
              'memori-tab-switch__tab--pressed': pressed,
            })}
            aria-pressed={pressed}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitch;
