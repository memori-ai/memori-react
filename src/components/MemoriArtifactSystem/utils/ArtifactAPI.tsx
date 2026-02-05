import { useEffect, useRef } from 'react';
import { useArtifact } from '../context/ArtifactContext';
import type { ArtifactData } from '../types/artifact.types';
import { Message } from '@memori.ai/memori-api-client/dist/types';

// Queue for calls made before the component is ready
const pendingCalls: Array<{ method: string; args: any[] }> = [];
let isReady = false;

/**
 * Initialize the MemoriArtifactAPI stub on window
 * This should be called as early as possible to prevent "undefined" errors
 */
export const initMemoriArtifactAPI = () => {
  if (typeof window === 'undefined') return;
  
  // Only initialize if not already present
  if ((window as any).MemoriArtifactAPI) {
    return;
  }

  (window as any).MemoriArtifactAPI = {
    _isReady: () => isReady,
    _setReady: (ready: boolean) => { isReady = ready; },
    _getPendingCalls: () => pendingCalls,
    _clearPendingCalls: () => { pendingCalls.length = 0; },
    
    openArtifact: (artifact: ArtifactData) => {
      if (!isReady) {
        pendingCalls.push({ method: 'openArtifact', args: [artifact] });
      }
    },
    createAndOpenArtifact: (content: string, mimeType?: string, title?: string) => {
      if (!isReady) {
        pendingCalls.push({ method: 'createAndOpenArtifact', args: [content, mimeType, title] });
      }
    },
    createFromOutputElement: (outputElement: HTMLOutputElement) => {
      if (!isReady) {
        pendingCalls.push({ method: 'createFromOutputElement', args: [outputElement] });
        return 'pending';
      }
      return 'not-ready';
    },
    closeArtifact: () => {
      if (!isReady) {
        pendingCalls.push({ method: 'closeArtifact', args: [] });
      }
    },
    toggleFullscreen: () => {
      if (!isReady) {
        pendingCalls.push({ method: 'toggleFullscreen', args: [] });
      }
    },
    getState: () => {
      if (!isReady) {
        return { currentArtifact: null, isDrawerOpen: false, isFullscreen: false };
      }
      return { currentArtifact: null, isDrawerOpen: false, isFullscreen: false };
    },
  };
};

// Initialize immediately when this module is loaded
initMemoriArtifactAPI();

/**
 * Componente che espone le funzioni dell'Artifact System come API globale
 * Questo permette di controllare gli artifacts da JavaScript vanilla esterno
 */
export const ArtifactAPIBridge = ({
  pushMessage,
}: {
  pushMessage: (message: Message) => void;
}) => {
  const { openArtifact, closeArtifact, toggleFullscreen, state } =
    useArtifact();
  
  const apiRef = useRef<any>(null);

  useEffect(() => {
    // Update API with actual implementations
    if (typeof window !== 'undefined') {
      const windowApi = (window as any).MemoriArtifactAPI;
      
      // Store reference to actual implementations
      apiRef.current = {
        /**
         * Apri un artifact esistente
         * @param artifact - Oggetto ArtifactData completo
         */
        openArtifact: (artifact: ArtifactData) => {
          openArtifact(artifact);
        },

        /**
         * Crea e apri un artifact con parametri semplici
         * @param content - Contenuto dell'artifact (HTML, markdown, ecc.)
         * @param mimeType - Tipo MIME (default: 'html')
         * @param title - Titolo da mostrare (default: auto-generato)
         */
        createAndOpenArtifact: (
          content: string,
          mimeType: string = 'html',
          title?: string
        ) => {
          const autoTitle = title || getTitleFromMimeType(mimeType);

          // Create the artifact object
          const artifact: ArtifactData = {
            id: `artifact-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            content,
            mimeType,
            title: autoTitle,
            timestamp: new Date(),
            size: content.length,
          };

          // Create wrapped message text for artifact detection
          // Don't reassign content parameter - use a new variable
          let messageText = content;
          if (!messageText.includes('<output class="memori-artifact">')) {
            messageText = `<output class="memori-artifact" data-mimetype="${mimeType}" data-title="${autoTitle}">${content}</output>`;
          }

          //we have to push in the history the artifact as message
          pushMessage({
            text: messageText,
            timestamp: new Date().toISOString(),
            fromUser: false as const,
            media: [],
            initial: false,
            translatedText: undefined,
            questionAnswered: undefined,
            generatedByAI: false,
            contextVars: undefined,
            date: undefined,
            placeName: undefined,
            placeLatitude: undefined,
            placeLongitude: undefined,
            placeUncertaintyKm: undefined,
          });

          // Open the artifact immediately
          openArtifact(artifact);
        },

        /**
         * Crea un artifact da un elemento <output> esistente nel DOM
         * @param outputElement - Elemento DOM <output class="memori-artifact">
         * @returns artifactId
         */
        createFromOutputElement: (outputElement: HTMLOutputElement) => {
          const content = outputElement.innerHTML;
          const mimeType =
            outputElement.getAttribute('data-mimetype') || 'html';
          const title =
            outputElement.getAttribute('data-title') ||
            getTitleFromMimeType(mimeType);

          // Nascondi l'elemento originale
          outputElement.style.display = 'none';
          outputElement.setAttribute('data-memori-processed', 'true');

          const artifact: ArtifactData = {
            id: `artifact-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            content,
            mimeType,
            title,
            timestamp: new Date(),
            size: content.length,
          };

          // Create wrapped message text for artifact detection
          // Don't reassign content - use a new variable
          let messageText = content;
          if (!messageText.includes('<output class="memori-artifact">')) {
            messageText = `<output class="memori-artifact" data-mimetype="${mimeType}" data-title="${title}">${content}</output>`;
          }

          pushMessage({
            text: messageText,
            timestamp: new Date().toISOString(),
            fromUser: false as const,
            media: [],
            initial: false,
            translatedText: undefined,
            questionAnswered: undefined,
            generatedByAI: false,
            contextVars: undefined,
            date: undefined,
            placeName: undefined,
            placeLatitude: undefined,
            placeLongitude: undefined,
            placeUncertaintyKm: undefined,
          });

          // Open the artifact immediately
          openArtifact(artifact);

          return artifact.id;
        },

        /**
         * Chiudi l'artifact drawer corrente
         */
        closeArtifact: () => {
          closeArtifact();
        },

        /**
         * Toggle fullscreen dell'artifact drawer
         */
        toggleFullscreen: () => {
          toggleFullscreen();
        },

        /**
         * Ottieni lo stato corrente del sistema artifacts
         */
        getState: () => {
          return {
            currentArtifact: state.currentArtifact,
            isDrawerOpen: state.isDrawerOpen,
            isFullscreen: state.isFullscreen,
          };
        },
      };

      // Update window API methods to use the real implementations
      if (windowApi) {
        windowApi.openArtifact = apiRef.current.openArtifact;
        windowApi.createAndOpenArtifact = apiRef.current.createAndOpenArtifact;
        windowApi.createFromOutputElement = apiRef.current.createFromOutputElement;
        windowApi.closeArtifact = apiRef.current.closeArtifact;
        windowApi.toggleFullscreen = apiRef.current.toggleFullscreen;
        windowApi.getState = apiRef.current.getState;

        // Mark API as ready
        windowApi._setReady(true);
        
        // Process any pending calls that were queued before ready
        const pendingCalls = windowApi._getPendingCalls();
        if (pendingCalls.length > 0) {
          pendingCalls.forEach((call: { method: string; args: any[] }) => {
            try {
              const method = (apiRef.current as any)[call.method];
              if (method) {
                method(...call.args);
              }
            } catch (error) {
              // Swallow error, remove log
            }
          });
          windowApi._clearPendingCalls();
        }
      } else {
        // If windowApi doesn't exist yet, initialize it now
        (window as any).MemoriArtifactAPI = {
          ...apiRef.current,
          _isReady: true,
          _pendingCalls: [],
          _setReady: (ready: boolean) => {
            (window as any).MemoriArtifactAPI._isReady = ready;
          },
          _getPendingCalls: () => {
            return (window as any).MemoriArtifactAPI._pendingCalls;
          },
          _clearPendingCalls: () => {
            (window as any).MemoriArtifactAPI._pendingCalls = [];
          },
        };
      }
    }

    return () => {
      // Clean up the API on unmount
      if (typeof window !== 'undefined') {
        delete (window as any).MemoriArtifactAPI;
      }
    };
  }, [openArtifact, closeArtifact, toggleFullscreen, state, pushMessage]);

  return null;
};

// Helper functions
function getTitleFromMimeType(mimeType: string): string {
  if (mimeType.includes('html')) return 'HTML Document';
  if (mimeType.includes('markdown')) return 'Markdown Document';
  if (mimeType.includes('javascript')) return 'JavaScript Code';
  if (mimeType.includes('python')) return 'Python Code';
  if (mimeType.includes('json')) return 'JSON Data';
  if (mimeType.includes('css')) return 'CSS Stylesheet';
  if (mimeType.includes('typescript')) return 'TypeScript Code';
  if (mimeType.includes('xml')) return 'XML Document';
  if (mimeType.includes('svg')) return 'SVG Image';
  return 'Document';
}

function createArtifactHandler(
  content: string,
  mimeType: string,
  title: string
): HTMLDivElement {
  const handler = document.createElement('div');
  handler.className = 'memori-artifact-handler';
  handler.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    margin: 12px 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: .5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  `;

  const icon = getIconForMimeType(mimeType);
  const size = `${(content.length / 1024).toFixed(1)} KB`;

  handler.innerHTML = `
    <div style="font-size: 32px;">${icon}</div>
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(
        title
      )}</div>
      <div style="font-size: 13px; color: #6b7280;">${mimeType} • ${size}</div>
    </div>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  `;

  handler.addEventListener('mouseenter', () => {
    handler.style.background = '#faf5ff';
    handler.style.borderColor = '#9333ea';
  });

  handler.addEventListener('mouseleave', () => {
    handler.style.background = 'white';
    handler.style.borderColor = '#e5e7eb';
  });

  return handler;
}

function getIconForMimeType(mimeType: string): string {
  if (mimeType.includes('html')) return '🌐';
  if (mimeType.includes('markdown')) return '📝';
  if (mimeType.includes('javascript') || mimeType.includes('typescript'))
    return '📜';
  if (mimeType.includes('python')) return '🐍';
  if (mimeType.includes('json')) return '📊';
  if (mimeType.includes('css')) return '🎨';
  if (mimeType.includes('xml')) return '📋';
  if (mimeType.includes('svg')) return '🖼️';
  return '📄';
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
