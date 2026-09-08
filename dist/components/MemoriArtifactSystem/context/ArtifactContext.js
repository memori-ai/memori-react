"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArtifact = exports.ArtifactProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const applyEdits_1 = require("../utils/applyEdits");
const ArtifactContext = (0, react_1.createContext)(null);
const ArtifactProvider = ({ children }) => {
    const [state, setState] = (0, react_1.useState)({
        currentArtifact: null,
        isDrawerOpen: false,
        isFullscreen: false,
    });
    const registryRef = (0, react_1.useRef)({});
    const openArtifact = (0, react_1.useCallback)((artifact) => {
        setState(() => ({
            currentArtifact: artifact,
            isDrawerOpen: true,
            isFullscreen: false,
        }));
    }, []);
    const closeArtifact = (0, react_1.useCallback)(() => {
        setState(prev => ({
            ...prev,
            currentArtifact: null,
            isDrawerOpen: false,
            isFullscreen: false,
        }));
    }, []);
    const toggleFullscreen = (0, react_1.useCallback)(() => {
        setState(prev => ({
            ...prev,
            isFullscreen: !prev.isFullscreen,
        }));
    }, []);
    const registerArtifact = (0, react_1.useCallback)((artifact) => {
        if (!(artifact === null || artifact === void 0 ? void 0 : artifact.artifactId))
            return;
        registryRef.current[artifact.artifactId] = artifact;
    }, []);
    const applyArtifactUpdate = (0, react_1.useCallback)((artifactId, edits) => {
        const current = registryRef.current[artifactId];
        if (!current) {
            return {
                success: false,
                failedEdits: edits,
                updatedArtifact: null,
                failureReason: 'not-found',
            };
        }
        const { content, failedEdits, appliedCount } = (0, applyEdits_1.applyEdits)(current.content, edits);
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
    const contextValue = (0, react_1.useMemo)(() => ({
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
    return ((0, jsx_runtime_1.jsx)(ArtifactContext.Provider, { value: contextValue, children: children }));
};
exports.ArtifactProvider = ArtifactProvider;
const useArtifact = () => {
    const context = (0, react_1.useContext)(ArtifactContext);
    if (!context) {
        throw new Error('useArtifact must be used within ArtifactProvider');
    }
    return context;
};
exports.useArtifact = useArtifact;
//# sourceMappingURL=ArtifactContext.js.map