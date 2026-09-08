import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useMemo, useRef, } from 'react';
import { applyEdits } from '../utils/applyEdits';
const ArtifactContext = createContext(null);
export const ArtifactProvider = ({ children }) => {
    const [state, setState] = useState({
        currentArtifact: null,
        isDrawerOpen: false,
        isFullscreen: false,
    });
    const registryRef = useRef({});
    const openArtifact = useCallback((artifact) => {
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
    const registerArtifact = useCallback((artifact) => {
        if (!(artifact === null || artifact === void 0 ? void 0 : artifact.artifactId))
            return;
        registryRef.current[artifact.artifactId] = artifact;
    }, []);
    const applyArtifactUpdate = useCallback((artifactId, edits) => {
        const current = registryRef.current[artifactId];
        if (!current) {
            return {
                success: false,
                failedEdits: edits,
                updatedArtifact: null,
                failureReason: 'not-found',
            };
        }
        const { content, failedEdits, appliedCount } = applyEdits(current.content, edits);
        if (appliedCount === 0) {
            return {
                success: false,
                failedEdits,
                updatedArtifact: null,
                failureReason: 'no-match',
            };
        }
        const updatedArtifact = {
            id: `artifact-ui-${artifactId}-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            artifactId,
            content,
            mimeType: current.mimeType,
            title: current.title,
            timestamp: new Date(),
            size: content.length,
        };
        registryRef.current[artifactId] = updatedArtifact;
        setState(prev => {
            var _a;
            if (prev.isDrawerOpen &&
                ((_a = prev.currentArtifact) === null || _a === void 0 ? void 0 : _a.artifactId) === artifactId) {
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
    }, []);
    const contextValue = useMemo(() => ({
        state,
        openArtifact,
        closeArtifact,
        toggleFullscreen,
        registerArtifact,
        applyArtifactUpdate,
    }), [
        state,
        openArtifact,
        closeArtifact,
        toggleFullscreen,
        registerArtifact,
        applyArtifactUpdate,
    ]);
    return (_jsx(ArtifactContext.Provider, { value: contextValue, children: children }));
};
export const useArtifact = () => {
    const context = useContext(ArtifactContext);
    if (!context) {
        throw new Error('useArtifact must be used within ArtifactProvider');
    }
    return context;
};
//# sourceMappingURL=ArtifactContext.js.map