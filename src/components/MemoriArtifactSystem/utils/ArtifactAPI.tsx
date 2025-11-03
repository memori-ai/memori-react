import { useEffect } from 'react';
import { useArtifact } from '../context/ArtifactContext';
import type { ArtifactData } from '../types/artifact.types';

/**
 * Componente che espone le funzioni dell'Artifact System come API globale
 * Questo permette di controllare gli artifacts da JavaScript vanilla esterno
 */
export const ArtifactAPIBridge = () => {
  const { openArtifact, closeArtifact, toggleFullscreen, state } = useArtifact();

  useEffect(() => {
    // Esponi le API globalmente
    if (typeof window !== 'undefined') {
      (window as any).MemoriArtifactAPI = {
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
          
          const artifact: ArtifactData = {
            id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content,
            mimeType,
            title: autoTitle,
            timestamp: new Date(),
            size: content.length,
          };
          
          openArtifact(artifact);
        },

        /**
         * Crea un artifact da un elemento <output> esistente nel DOM
         * @param outputElement - Elemento DOM <output class="memori-artifact">
         * @returns artifactId
         */
        createFromOutputElement: (outputElement: HTMLOutputElement) => {
          const content = outputElement.innerHTML;
          const mimeType = outputElement.getAttribute('data-mimetype') || 'html';
          const title = outputElement.getAttribute('data-title') || getTitleFromMimeType(mimeType);
          
          // Nascondi l'elemento originale
          outputElement.style.display = 'none';
          outputElement.setAttribute('data-memori-processed', 'true');
          
          const artifact: ArtifactData = {
            id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content,
            mimeType,
            title,
            timestamp: new Date(),
            size: content.length,
          };
          
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

        /**
         * Processa tutti gli <output class="memori-artifact"> non ancora processati nella pagina
         * @param rootElement - Elemento root da cui cercare (default: document)
         * @returns Array di artifact IDs processati
         */
        processAllArtifacts: (rootElement: Document | HTMLElement = document) => {
          const outputs = rootElement.querySelectorAll(
            'output.memori-artifact:not([data-memori-processed])'
          ) as unknown as NodeList;
          
          const processedIds: string[] = [];
          
          outputs.forEach((output: Node, index: number) => {
            if (!(output instanceof HTMLOutputElement)) return;
            
            output.setAttribute('data-memori-processed', 'true');
            
            const content = output.innerHTML;
            const mimeType = output.getAttribute('data-mimetype') || 'html';
            const title = output.getAttribute('data-title') || getTitleFromMimeType(mimeType);
            
            // Crea handler visivo (card cliccabile)
            const handler = createArtifactHandler(content, mimeType, title);
            
            // Inserisci dopo l'output
            output.style.display = 'none';
            output.parentElement?.insertBefore(handler, output.nextSibling);
            
            // Setup click handler
            const artifactId = `artifact-${Date.now()}-${index}`;
            handler.addEventListener('click', () => {
              const artifact: ArtifactData = {
                id: artifactId,
                content,
                mimeType,
                title,
                timestamp: new Date(),
                size: content.length,
              };
              openArtifact(artifact);
            });
            
            processedIds.push(artifactId);
          });
          
          return processedIds;
        },
      };

      console.log('✅ MemoriArtifactAPI esposta su window.MemoriArtifactAPI');
      console.log('Funzioni disponibili:', Object.keys((window as any).MemoriArtifactAPI));
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).MemoriArtifactAPI;
      }
    };
  }, [openArtifact, closeArtifact, toggleFullscreen, state]);

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

function createArtifactHandler(content: string, mimeType: string, title: string): HTMLDivElement {
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
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  `;
  
  const icon = getIconForMimeType(mimeType);
  const size = `${(content.length / 1024).toFixed(1)} KB`;
  
  handler.innerHTML = `
    <div style="font-size: 32px;">${icon}</div>
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(title)}</div>
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
  if (mimeType.includes('javascript') || mimeType.includes('typescript')) return '📜';
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

