import React from 'react';
interface BaseAction {
    weight: number;
    action?: string;
}
export interface AnimationControlPanelProps {
    baseActions: Record<string, BaseAction>;
    onBaseActionChange: (action: string, outputContent: string) => void;
    currentBaseAction: {
        action: string;
        weight: number;
    };
    onMorphTargetInfluencesChange: (influences: {
        [key: string]: number;
    }) => void;
    onMorphTargetDictionaryChange: (dictionary: {
        [key: string]: number;
    }) => void;
    morphTargetDictionary: {
        [key: string]: number;
    };
    modifyTimeScale: (value: number) => void;
    timeScale: number;
}
declare const AnimationControlPanel: React.FC<AnimationControlPanelProps>;
export default AnimationControlPanel;
