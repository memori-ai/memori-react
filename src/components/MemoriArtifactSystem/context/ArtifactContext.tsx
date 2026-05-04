import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ArtifactData, ArtifactSystemState } from '../types/artifact.types';

export type OpenArtifactOptions = {
  /** Inline expansion in chat; layouts should not hide avatar / use side-drawer chrome. */
  isChatLogPanel?: boolean;
};

interface ArtifactContextType {
  state: ArtifactSystemState;
  openArtifact: (artifact: ArtifactData, options?: OpenArtifactOptions) => void;
  closeArtifact: () => void;
  toggleFullscreen: () => void;
}

const ArtifactContext = createContext<ArtifactContextType | null>(null);

export const ArtifactProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ArtifactSystemState>({
    currentArtifact: null,
    isDrawerOpen: false,
    isFullscreen: false,
    isChatLogPanelPresentation: false,
  });

  const openArtifact = useCallback(
    (artifact: ArtifactData, options?: OpenArtifactOptions) => {
      setState(() => {
        return {
          currentArtifact: artifact,
          isDrawerOpen: true,
          isFullscreen: false,
          isChatLogPanelPresentation: options?.isChatLogPanel ?? false,
        };
      });
    },
    []
  );

  const closeArtifact = useCallback(() => {
    setState(prev => {
      // if (!prev.isDrawerOpen) return prev;
      return {
        ...prev,
        currentArtifact: null,
        isDrawerOpen: false,
        isFullscreen: false,
        isChatLogPanelPresentation: false,
      };
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  const contextValue = useMemo(() => ({
    state,
    openArtifact,
    closeArtifact,
    toggleFullscreen,
  }), [state, openArtifact, closeArtifact, toggleFullscreen]);

  return (
    <ArtifactContext.Provider value={contextValue}>
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
