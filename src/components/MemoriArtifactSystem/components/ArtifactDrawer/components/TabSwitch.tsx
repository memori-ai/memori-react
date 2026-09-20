import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Code, Eye } from 'lucide-react';
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

  const tabs: { id: ArtifactTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'preview',
      label: t('artifact.preview') || 'Preview',
      icon: <Eye className="memori-tab-switch__icon" aria-hidden />,
    },
    {
      id: 'code',
      label: t('artifact.source') || t('artifact.code') || 'Source',
      icon: <Code className="memori-tab-switch__icon" aria-hidden />,
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
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitch;
