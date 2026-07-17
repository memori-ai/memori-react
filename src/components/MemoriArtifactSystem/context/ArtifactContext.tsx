import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  ArtifactData,
  ArtifactEdit,
  ArtifactSystemState,
  ApplyUpdateResult,
} from '../types/artifact.types';
import { applyEdits } from '../utils/applyEdits';

interface ArtifactContextType {
  state: ArtifactSystemState;
  openArtifact: (artifact: ArtifactData) => void;
  closeArtifact: () => void;
  toggleFullscreen: () => void;
  registerArtifact: (artifact: ArtifactData) => void;
  applyArtifactUpdate: (
    artifactId: string,
    edits: ArtifactEdit[]
  ) => ApplyUpdateResult;
}

const ArtifactContext = createContext<ArtifactContextType | null>(null);

export const ArtifactProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ArtifactSystemState>({
    currentArtifact: null,
    isDrawerOpen: false,
    isFullscreen: false,
  });

  // Synchronous registry keyed by stable artifactId → latest version.
  // useRef avoids race where update handlers read empty React state
  // right after a create in the same render cycle.
  const registryRef = useRef<Record<string, ArtifactData>>({});

  const openArtifact = useCallback((artifact: ArtifactData) => {
    setState(() => ({
      currentArtifact: artifact,
      isDrawerOpen: true,
      isFullscreen: false,
    }));
  }, []);

  const closeArtifact = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentArtifact: null,
      isDrawerOpen: false,
      isFullscreen: false,
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  const registerArtifact = useCallback((artifact: ArtifactData) => {
    if (!artifact?.artifactId) return;
    registryRef.current[artifact.artifactId] = artifact;
  }, []);

  const applyArtifactUpdate = useCallback(
    (artifactId: string, edits: ArtifactEdit[]): ApplyUpdateResult => {
      const current = registryRef.current[artifactId];
      if (!current) {
        return {
          success: false,
          failedEdits: edits,
          updatedArtifact: null,
        };
      }

      const { content, failedEdits, appliedCount } = applyEdits(
        current.content,
        edits
      );

      if (appliedCount === 0) {
        return {
          success: false,
          failedEdits,
          updatedArtifact: null,
        };
      }

      const updatedArtifact: ArtifactData = {
        id: `artifact-ui-${artifactId}-${Date.now()}`,
        artifactId,
        content,
        mimeType: current.mimeType,
        title: current.title,
        timestamp: new Date(),
        size: content.length,
      };

      registryRef.current[artifactId] = updatedArtifact;

      setState(prev => {
        if (
          prev.isDrawerOpen &&
          prev.currentArtifact?.artifactId === artifactId
        ) {
          return {
            ...prev,
            currentArtifact: updatedArtifact,
          };
        }
        return prev;
      });

      return {
        success: failedEdits.length === 0,
        failedEdits,
        updatedArtifact,
      };
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      state,
      openArtifact,
      closeArtifact,
      toggleFullscreen,
      registerArtifact,
      applyArtifactUpdate,
    }),
    [
      state,
      openArtifact,
      closeArtifact,
      toggleFullscreen,
      registerArtifact,
      applyArtifactUpdate,
    ]
  );

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
