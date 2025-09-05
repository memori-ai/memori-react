/**
 * Custom hook for managing the artifact system state and actions
 * Following React best practices and the project's patterns
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ArtifactSystemState, 
  ArtifactSystemActions, 
  ArtifactSystemConfig, 
  ArtifactSystemHook,
  ArtifactData,
  ArtifactHistoryEntry,
  DEFAULT_ARTIFACT_CONFIG,
  SUPPORTED_MIME_TYPES
} from '../types/artifact.types';

/**
 * Custom hook for managing artifact system state and actions
 */
export const useArtifactSystem = (config: Partial<ArtifactSystemConfig> = {}): ArtifactSystemHook => {
  console.log('Initializing artifact system with config:', config);
  
  const mergedConfig = { ...DEFAULT_ARTIFACT_CONFIG, ...config };
  
  const [state, setState] = useState<ArtifactSystemState>({
    history: [
    ],
    currentArtifact: null,
    isDrawerOpen: false,
    isFullscreen: false,
    processedArtifacts: new Set(['artifact-1', 'artifact-2']),
    artifactCounter: 2,
  });

  const processedArtifactsRef = useRef<Set<string>>(new Set());

  // Update ref when state changes
  useEffect(() => {
    console.log('Updating processed artifacts ref:', state.processedArtifacts);
    processedArtifactsRef.current = state.processedArtifacts;
  }, [state.processedArtifacts]);

  /**
   * Add a new artifact to the system
   */
  const addArtifact = useCallback((artifact: ArtifactData) => {
    console.log('Adding artifact:', artifact);
    setState(prevState => {
      // Check if artifact already exists
      const existingIndex = prevState.history.findIndex(item => item.id === artifact.id);
      
      let newHistory: ArtifactHistoryEntry[];
      if (existingIndex >= 0) {
        console.log('Updating existing artifact at index:', existingIndex);
        // Update existing artifact
        newHistory = [...prevState.history];
        newHistory[existingIndex] = { ...artifact, isActive: false };
      } else {
        console.log('Adding new artifact to history');
        // Add new artifact
        newHistory = [
          { ...artifact, isActive: false },
          ...prevState.history.slice(0, (mergedConfig.maxHistoryItems || 50) - 1)
        ];
      }

      return {
        ...prevState,
        history: newHistory,
        artifactCounter: prevState.artifactCounter + 1,
      };
    });
  }, [mergedConfig.maxHistoryItems]);

  /**
   * Select an artifact and open the drawer
   */
  const selectArtifact = useCallback((artifact: ArtifactData) => {
    console.log('Selecting artifact:', artifact);
    setState(prevState => {
      const newHistory = prevState.history.map(item => ({
        ...item,
        isActive: item.id === artifact.id,
      }));

      return {
        ...prevState,
        currentArtifact: artifact,
        isDrawerOpen: true,
        history: newHistory,
      };
    });
  }, []);

  /**
   * Close the artifact drawer
   */
  const closeDrawer = useCallback(() => {
    console.log('Closing artifact drawer');
    setState(prevState => ({
      ...prevState,
      isDrawerOpen: false,
      isFullscreen: false,
      currentArtifact: null,
      history: prevState.history.map(item => ({ ...item, isActive: false })),
    }));
  }, []);

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = useCallback(() => {
    console.log('Toggling fullscreen mode');
    setState(prevState => ({
      ...prevState,
      isFullscreen: !prevState.isFullscreen,
    }));
  }, []);

  /**
   * Clear all artifact history
   */
  const clearHistory = useCallback(() => {
    console.log('Clearing artifact history');
    setState(prevState => ({
      ...prevState,
      history: [],
      currentArtifact: null,
      isDrawerOpen: false,
      isFullscreen: false,
      processedArtifacts: new Set(),
      artifactCounter: 0,
    }));
    processedArtifactsRef.current.clear();
  }, []);

  /**
   * Remove a specific artifact from history
   */
  const removeArtifact = useCallback((id: string) => {
    console.log('Removing artifact:', id);
    setState(prevState => {
      const newHistory = prevState.history.filter(item => item.id !== id);
      const isRemovingCurrent = prevState.currentArtifact?.id === id;
      
      return {
        ...prevState,
        history: newHistory,
        currentArtifact: isRemovingCurrent ? null : prevState.currentArtifact,
        isDrawerOpen: isRemovingCurrent ? false : prevState.isDrawerOpen,
      };
    });
  }, []);

  const actions: ArtifactSystemActions = {
    addArtifact,
    selectArtifact,
    closeDrawer,
    toggleFullscreen,
    clearHistory,
    removeArtifact,
  };

  return {
    state,
    actions,
    config: mergedConfig,
  };
};

/**
 * Hook for creating artifacts from content
 */
export const useArtifactCreator = () => {
  const generateId = useCallback((content: string, mimeType: string): string => {
    console.log('Generating ID for content type:', mimeType);
    const timestamp = Date.now();
    const hash = content.substring(0, 100).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `artifact-${mimeType}-${Math.abs(hash)}-${timestamp}`;
  }, []);

  const createArtifact = useCallback((
    content: string,
    mimeType: string,
    customTitle?: string,
    messageID?: string
  ): ArtifactData => {
    console.log('Creating artifact:', { mimeType, customTitle, messageID });
    const typeInfo = SUPPORTED_MIME_TYPES[mimeType as keyof typeof SUPPORTED_MIME_TYPES] || {
      name: mimeType.toUpperCase(),
      icon: '📄',
      hasPreview: false,
      language: 'text',
      mimeType: 'text/plain',
    };

    const title = customTitle || `${typeInfo.icon} ${typeInfo.name} Artifact`;
    const id = generateId(content, mimeType);

    return {
      id,
      content,
      mimeType: mimeType as any,
      typeInfo,
      title,
      customTitle,
      messageID: messageID || '',
      timestamp: new Date(),
      size: content.length,
    };
  }, [generateId]);

  return { createArtifact };
};

/**
 * Hook for processing artifact content from messages
 */
export const useArtifactProcessor = () => {
  const processedArtifacts = useRef<Set<string>>(new Set());

  const generateContentHash = useCallback((content: string): string => {
    console.log('Generating content hash');
    let hash = 0;
    const str = content.substring(0, 500);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }, []);

  const removeThinkTags = useCallback((text: string): string => {
    console.log('Removing think tags from text');
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  }, []);

  const isValidArtifact = useCallback((content: string, mimeType: string): boolean => {
    console.log('Validating artifact:', { mimeType, contentLength: content.length });
    // Minimum size check
    if (content.length < 50) {
      console.log('Artifact too small');
      return false;
    }

    // HTML validation
    if (mimeType === 'html') {
      if (!content.includes('<!DOCTYPE') && !content.includes('<html')) {
        console.log('Invalid HTML: missing DOCTYPE or html tag');
        return false;
      }
      if (content.includes('<!DOCTYPE') && !content.includes('</html>')) {
        console.log('Invalid HTML: unclosed html tag');
        return false;
      }
    }

    // JSON validation
    if (mimeType === 'json') {
      try {
        JSON.parse(content);
      } catch (e) {
        console.log('Invalid JSON:', e);
        return false;
      }
    }

    return true;
  }, []);

  const cleanArtifactContent = useCallback((content: string, mimeType: string): string => {
    console.log('Cleaning artifact content:', { mimeType });
    if (!content) return '';
    
    // Remove closing output tags
    content = content.replace(/<\/output>/gi, '');
    
    // HTML specific cleaning
    if (mimeType === 'html') {
      if (content.includes('<!DOCTYPE html') && !content.includes('</html>')) {
        content += '\n</html>';
      }
    }
    
    // JSON validation and cleaning
    if (mimeType === 'json') {
      try {
        JSON.parse(content);
      } catch (e) {
        console.log('Failed to parse JSON:', e);
        return '';
      }
    }
    
    return content.trim();
  }, []);

  // Process content that may contain artifact tags and extract artifacts
  const processArtifactContent = useCallback((
    // The text content to process for artifacts
    emission: string,
    // Callback function called when an artifact is found
    onArtifactFound: (content: string, mimeType: string, title?: string) => void
  ): boolean => {
    console.log('Processing artifact content');
    // Return false if emission is empty or not a string
    if (!emission || typeof emission !== 'string') return false;
    
    // Track if any artifacts were processed
    let processed = false;
    
    // Remove any <think> tags from the emission
    const cleanedEmission = removeThinkTags(emission);
    
    // Regex to find <output> tags with class="memori-artifact" and data-mimetype
    // Captures the mimetype and content between tags
    const outputRegex = /<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-mimetype\s*=\s*["\']([^"']+)["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi;
    
    // Array to store found artifacts with their metadata
    const foundArtifacts: Array<{
      fullMatch: string;  // The full matched output tag
      mimeType: string;   // The mimetype of the artifact
      content: string;    // The content between tags
      size: number;       // Content length
      extractedTitle?: string; // Optional title from data-title attribute
    }> = [];
    
    let match;
    // Find all artifact output tags in the cleaned emission
    while ((match = outputRegex.exec(cleanedEmission)) !== null) {
      console.log('Found artifact match:', { mimeType: match[1] });
      const fullTag = match[0];
      const mimeType = match[1];
      let content = match[2].trim();
      
      // Look for an optional data-title attribute
      const titleMatch = fullTag.match(/data-title\s*=\s*["\']([^"']+)["\']/i);
      const extractedTitle = titleMatch ? titleMatch[1] : undefined;
      console.log('Extracted title:', extractedTitle);
      
      // Clean the content and validate it matches the mimetype
      content = cleanArtifactContent(content, mimeType);
      
      // Skip if content is empty or invalid
      if (!content || !isValidArtifact(content, mimeType)) {
        console.log('Skipping invalid artifact');
        continue;
      }
      
      // Add valid artifact to found array
      foundArtifacts.push({
        fullMatch: match[0],
        mimeType,
        content,
        size: content.length,
        extractedTitle,
      });
    }
    
    // Sort artifacts by size descending and deduplicate by mimetype
    // keeping only the largest artifact of each type
    foundArtifacts.sort((a, b) => b.size - a.size);
    const uniqueByType = new Map<string, typeof foundArtifacts[0]>();
    
    for (const artifact of foundArtifacts) {
      if (!uniqueByType.has(artifact.mimeType)) {
        uniqueByType.set(artifact.mimeType, artifact);
      }
    }
    
    // Process each unique artifact that hasn't been processed before
    for (const artifact of uniqueByType.values()) {
      const hash = generateContentHash(artifact.fullMatch);
      
      // Only process new artifacts we haven't seen before
      if (!processedArtifacts.current.has(hash)) {
        console.log('Processing new artifact:', { mimeType: artifact.mimeType, hash });
        processedArtifacts.current.add(hash);
        onArtifactFound(artifact.content, artifact.mimeType, artifact.extractedTitle);
        processed = true;
      }
    }
    
    // Return whether any new artifacts were processed
    return processed;
  }, [removeThinkTags, cleanArtifactContent, isValidArtifact, generateContentHash]);

  return {
    processArtifactContent,
    processedArtifacts: processedArtifacts.current,
  };
};

/**
 * Hook for checking if a message contains artifacts
 */
export const useArtifactDetector = () => {
  const hasArtifacts = useCallback((messageText: string): boolean => {
    console.log('Checking for artifacts in message');
    if (!messageText || typeof messageText !== 'string') {
      return false;
    }

    // Remove think tags first
    const cleanedText = messageText.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Check for artifact output tags
    const outputRegex = /<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-mimetype\s*=\s*["\']([^"']+)["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi;
    
    return outputRegex.test(cleanedText);
  }, []);

  return { hasArtifacts };
};
