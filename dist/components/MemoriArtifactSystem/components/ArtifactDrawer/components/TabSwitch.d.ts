import React from 'react';
import { ArtifactTab } from '../../../types/artifact.types';
interface TabSwitchProps {
    activeTab: ArtifactTab;
    onTabChange: (tab: ArtifactTab) => void;
    hasPreview: boolean;
}
declare const TabSwitch: React.FC<TabSwitchProps>;
export default TabSwitch;
