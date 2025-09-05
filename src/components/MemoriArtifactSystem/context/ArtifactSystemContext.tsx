/**
 * ArtifactSystemContext
 * React Context for sharing artifact system state and actions across the application
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  ArtifactSystemState, 
  ArtifactSystemActions, 
  ArtifactSystemConfig,
  ArtifactSystemHook 
} from '../types/artifact.types';
import { useArtifactSystem } from '../hooks/useArtifactSystem';

// Context type definition
interface ArtifactSystemContextType extends ArtifactSystemHook {
  // Additional context-specific properties can be added here if needed
}

// Create the context
const ArtifactSystemContext = createContext<ArtifactSystemContextType | null>(null);

// Provider props interface
interface ArtifactSystemProviderProps {
  children: ReactNode;
  config?: Partial<ArtifactSystemConfig>;
}

// Provider component
export const ArtifactSystemProvider: React.FC<ArtifactSystemProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const artifactSystem = useArtifactSystem(config);

  return (
    <ArtifactSystemContext.Provider value={artifactSystem}>
      {children}
    </ArtifactSystemContext.Provider>
  );
};

// Custom hook to use the artifact system context
export const useArtifactSystemContext = (): ArtifactSystemContextType => {
  const context = useContext(ArtifactSystemContext);
  
  if (!context) {
    throw new Error(
      'useArtifactSystemContext must be used within an ArtifactSystemProvider'
    );
  }
  
  return context;
};

// Export the context for advanced usage
export { ArtifactSystemContext };
