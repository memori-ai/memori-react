import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ArtifactData, ArtifactSystemState } from '../types/artifact.types';

interface ArtifactContextType {
  state: ArtifactSystemState;
  openArtifact: (artifact: ArtifactData) => void;
  closeArtifact: () => void;
  toggleFullscreen: () => void;
}

const ArtifactContext = createContext<ArtifactContextType | null>(null);

export const ArtifactProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ArtifactSystemState>({
    currentArtifact: null,
    isDrawerOpen: false,
    isFullscreen: false,
  });

  const openArtifact = (artifact: ArtifactData) => {
    setState({
      currentArtifact: artifact,
      isDrawerOpen: true,
      isFullscreen: false,
    });
  };

  const closeArtifact = () => {
    setState(prev => ({
      ...prev,
      isDrawerOpen: false,
      isFullscreen: false,
    }));
  };

  const toggleFullscreen = () => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  };

  return (
    <ArtifactContext.Provider value={{ state, openArtifact, closeArtifact, toggleFullscreen }}>
      {children}
    </ArtifactContext.Provider>
  );
};

export const useArtifact = () => {
  const context = useContext(ArtifactContext);
  if (!context) {
    throw new Error('useArtifact must be used within ArtifactProvider');
  }
  return context;
};
