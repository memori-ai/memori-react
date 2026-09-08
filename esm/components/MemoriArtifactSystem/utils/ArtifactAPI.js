import { useEffect, useRef } from 'react';
import { useArtifact } from '../context/ArtifactContext';
const pendingCalls = [];
let isReady = false;
export const initMemoriArtifactAPI = () => {
    if (typeof window === 'undefined')
        return;
    if (window.MemoriArtifactAPI) {
        return;
    }
    window.MemoriArtifactAPI = {
        _isReady: () => isReady,
        _setReady: (ready) => { isReady = ready; },
        _getPendingCalls: () => pendingCalls,
        _clearPendingCalls: () => { pendingCalls.length = 0; },
        openArtifact: (artifact) => {
            if (!isReady) {
                pendingCalls.push({ method: 'openArtifact', args: [artifact] });
            }
        },
        createAndOpenArtifact: (content, mimeType, title) => {
            if (!isReady) {
                pendingCalls.push({ method: 'createAndOpenArtifact', args: [content, mimeType, title] });
            }
        },
        createFromOutputElement: (outputElement) => {
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
initMemoriArtifactAPI();
export const ArtifactAPIBridge = ({ pushMessage, }) => {
    const { openArtifact, closeArtifact, toggleFullscreen, state, registerArtifact } = useArtifact();
    const apiRef = useRef(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const windowApi = window.MemoriArtifactAPI;
            apiRef.current = {
                openArtifact: (artifact) => {
                    openArtifact(artifact);
                },
                createAndOpenArtifact: (content, mimeType = 'html', title) => {
                    const autoTitle = title || getTitleFromMimeType(mimeType);
                    const artifactId = `api-${Date.now()}-${Math.random()
                        .toString(36)
                        .substr(2, 9)}`;
                    const artifact = {
                        id: `artifact-ui-${artifactId}`,
                        artifactId,
                        content,
                        mimeType,
                        title: autoTitle,
                        timestamp: new Date(),
                        size: content.length,
                    };
                    let messageText = content;
                    if (!messageText.includes('class="memori-artifact"')) {
                        messageText = `<output class="memori-artifact" data-action="create" data-artifact-id="${artifactId}" data-mimetype="${mimeType}" data-title="${autoTitle}">${content}</output>`;
                    }
                    pushMessage({
                        text: messageText,
                        timestamp: new Date().toISOString(),
                        fromUser: false,
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
                    registerArtifact(artifact);
                    openArtifact(artifact);
                },
                createFromOutputElement: (outputElement) => {
                    const content = outputElement.innerHTML;
                    const mimeType = outputElement.getAttribute('data-mimetype') || 'html';
                    const title = outputElement.getAttribute('data-title') ||
                        getTitleFromMimeType(mimeType);
                    const artifactId = outputElement.getAttribute('data-artifact-id') ||
                        `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    outputElement.style.display = 'none';
                    outputElement.setAttribute('data-memori-processed', 'true');
                    const artifact = {
                        id: `artifact-ui-${artifactId}`,
                        artifactId,
                        content,
                        mimeType,
                        title,
                        timestamp: new Date(),
                        size: content.length,
                    };
                    let messageText = content;
                    if (!messageText.includes('class="memori-artifact"')) {
                        messageText = `<output class="memori-artifact" data-action="create" data-artifact-id="${artifactId}" data-mimetype="${mimeType}" data-title="${title}">${content}</output>`;
                    }
                    pushMessage({
                        text: messageText,
                        timestamp: new Date().toISOString(),
                        fromUser: false,
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
                    registerArtifact(artifact);
                    openArtifact(artifact);
                    return artifact.artifactId;
                },
                closeArtifact: () => {
                    closeArtifact();
                },
                toggleFullscreen: () => {
                    toggleFullscreen();
                },
                getState: () => {
                    return {
                        currentArtifact: state.currentArtifact,
                        isDrawerOpen: state.isDrawerOpen,
                        isFullscreen: state.isFullscreen,
                    };
                },
            };
            if (windowApi) {
                windowApi.openArtifact = apiRef.current.openArtifact;
                windowApi.createAndOpenArtifact = apiRef.current.createAndOpenArtifact;
                windowApi.createFromOutputElement = apiRef.current.createFromOutputElement;
                windowApi.closeArtifact = apiRef.current.closeArtifact;
                windowApi.toggleFullscreen = apiRef.current.toggleFullscreen;
                windowApi.getState = apiRef.current.getState;
                windowApi._setReady(true);
                const pendingCalls = windowApi._getPendingCalls();
                if (pendingCalls.length > 0) {
                    pendingCalls.forEach((call) => {
                        try {
                            const method = apiRef.current[call.method];
                            if (method) {
                                method(...call.args);
                            }
                        }
                        catch (error) {
                        }
                    });
                    windowApi._clearPendingCalls();
                }
            }
            else {
                window.MemoriArtifactAPI = {
                    ...apiRef.current,
                    _isReady: true,
                    _pendingCalls: [],
                    _setReady: (ready) => {
                        window.MemoriArtifactAPI._isReady = ready;
                    },
                    _getPendingCalls: () => {
                        return window.MemoriArtifactAPI._pendingCalls;
                    },
                    _clearPendingCalls: () => {
                        window.MemoriArtifactAPI._pendingCalls = [];
                    },
                };
            }
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete window.MemoriArtifactAPI;
            }
        };
    }, [openArtifact, closeArtifact, toggleFullscreen, state, pushMessage, registerArtifact]);
    return null;
};
function getTitleFromMimeType(mimeType) {
    if (mimeType.includes('html'))
        return 'HTML Document';
    if (mimeType.includes('markdown'))
        return 'Markdown Document';
    if (mimeType.includes('javascript'))
        return 'JavaScript Code';
    if (mimeType.includes('python'))
        return 'Python Code';
    if (mimeType.includes('json'))
        return 'JSON Data';
    if (mimeType.includes('css'))
        return 'CSS Stylesheet';
    if (mimeType.includes('typescript'))
        return 'TypeScript Code';
    if (mimeType.includes('xml'))
        return 'XML Document';
    if (mimeType.includes('svg'))
        return 'SVG Image';
    return 'Document';
}
function createArtifactHandler(content, mimeType, title) {
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
function getIconForMimeType(mimeType) {
    if (mimeType.includes('html'))
        return '🌐';
    if (mimeType.includes('markdown'))
        return '📝';
    if (mimeType.includes('javascript') || mimeType.includes('typescript'))
        return '📜';
    if (mimeType.includes('python'))
        return '🐍';
    if (mimeType.includes('json'))
        return '📊';
    if (mimeType.includes('css'))
        return '🎨';
    if (mimeType.includes('xml'))
        return '📋';
    if (mimeType.includes('svg'))
        return '🖼️';
    return '📄';
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
//# sourceMappingURL=ArtifactAPI.js.map