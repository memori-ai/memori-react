import React, { useEffect, useRef, useState } from 'react';
import GUI from 'lil-gui';

interface BaseAction {
  weight: number;
  action?: string;
}

interface AdditiveAction {
  weight: number;
  action?: string;
}

export interface AnimationControlPanelProps {
  baseActions: Record<string, BaseAction>;
  onBaseActionChange: (action: string) => void;
  currentBaseAction: {
    action: string;
    weight: number;
  };
  onMorphTargetInfluencesChange: (influences: { [key: string]: number }) => void;
  onMorphTargetDictionaryChange: (dictionary: { [key: string]: number }) => void;
  morphTargetDictionary: { [key: string]: number };
  modifyTimeScale: (value: number) => void;
  timeScale: number;
}

const AnimationControlPanel: React.FC<AnimationControlPanelProps> = ({
  onBaseActionChange,
  baseActions,
  modifyTimeScale,
  onMorphTargetInfluencesChange,
  onMorphTargetDictionaryChange,
  morphTargetDictionary,
  timeScale,
}) => {
  const guiRef = useRef<GUI | null>(null);
  const panelSettingsRef = useRef<Record<string, any>>({
    'modify time scale': timeScale,
  });
  const crossFadeControlsRef = useRef<any[]>([]);

  useEffect(() => {

    const gui = new GUI({ width: 310 });
    guiRef.current = gui;

    const folder1 = gui.addFolder('Base Actions');
    const folder2 = gui.addFolder('Additive Action Weights');
    const folder3 = gui.addFolder('General Speed');

    const baseNames = ['None', ...Object.keys(baseActions)];

    baseNames.forEach(name => {
      const settings = baseActions[name];
      panelSettingsRef.current[name] = () => {
        onBaseActionChange(name);
      };

      const control = folder1.add(panelSettingsRef.current, name);
      crossFadeControlsRef.current.push(control);
    });

    Object.entries(morphTargetDictionary).forEach(([name, settings]) => {
      panelSettingsRef.current[name] = settings/100;
      folder2
        .add(panelSettingsRef.current, name, -1.0, 1.0, 0.01)
        .listen()
        .onChange((weight: number) => {
          onMorphTargetInfluencesChange({ [name]: weight });
        });
    });

    folder3
      .add(panelSettingsRef.current, 'modify time scale', 0.0, 1.5, 0.01)
      .onChange((value: number) => {
        modifyTimeScale(value);
      });

    folder1.open();
    folder2.open();
    folder3.open();

    return () => {
      gui.destroy();
    };
  }, [
    onBaseActionChange,
    onMorphTargetInfluencesChange,
    onMorphTargetDictionaryChange,
    modifyTimeScale,
    baseActions,
    morphTargetDictionary,
    timeScale
  ]);

  return null; // This component doesn't render anything itself
};

export default AnimationControlPanel;
