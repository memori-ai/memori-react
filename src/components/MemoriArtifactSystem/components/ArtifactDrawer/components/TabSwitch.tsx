import React from 'react';
import { ArtifactTab } from '../../../types/artifact.types';
import { Tabs } from '@memori.ai/ui';
import { Code, Eye as PreviewIcon } from 'lucide-react';

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
      label: 'Code',
    },
    ...(hasPreview
      ? [
          {
            id: 'preview' as ArtifactTab,
            icon: PreviewIcon,
            label: 'Preview',
          },
        ]
      : []),
  ];

  return (
    <Tabs.Root
      className="memori-tab-switch"
      value={activeTab}
      onValueChange={value => onTabChange(value as ArtifactTab)}
      variant="segmented"
    >
      <Tabs.List
        className="memori-tab-switch__list"
        aria-label="Artifact content view"
      >
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <Tabs.Tab
              key={tab.id}
              value={tab.id}
              className="memori-tab-switch__tab"
              aria-label={tab.label}
            >
              <IconComponent className="memori-tab-switch__icon" />
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
    </Tabs.Root>
  );
};

export default TabSwitch;
