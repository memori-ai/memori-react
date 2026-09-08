"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const ArtifactContext_1 = require("../../context/ArtifactContext");
const ChevronRight_1 = tslib_1.__importDefault(require("../../../icons/ChevronRight"));
const ArtifactDrawer_1 = tslib_1.__importDefault(require("../ArtifactDrawer/ArtifactDrawer"));
const ChevronDown_1 = tslib_1.__importDefault(require("../../../icons/ChevronDown"));
const ChevronLeft_1 = tslib_1.__importDefault(require("../../../icons/ChevronLeft"));
const ChevronUp_1 = tslib_1.__importDefault(require("../../../icons/ChevronUp"));
const utils_1 = require("../../../../helpers/utils");
const applyEdits_1 = require("../../utils/applyEdits");
const react_i18next_1 = require("react-i18next");
const formatBytes = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const CLASS_ATTR_RE = /class\s*=\s*["']([^"']*)["']/i;
const DATA_ACTION_RE = /data-action\s*=\s*["']([^"']+)["']/i;
const getClassList = (openingTag) => {
    const m = openingTag.match(CLASS_ATTR_RE);
    if (!m)
        return [];
    return m[1].split(/\s+/).filter(Boolean);
};
const getDataAction = (openingTag) => {
    var _a;
    const m = openingTag.match(DATA_ACTION_RE);
    return ((_a = m === null || m === void 0 ? void 0 : m[1]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || null;
};
const isCreateArtifactTag = (openingTag) => {
    const classes = getClassList(openingTag);
    if (classes.includes('memori-artifact-update'))
        return false;
    if (!classes.includes('memori-artifact'))
        return false;
    const action = getDataAction(openingTag);
    return action === null || action === 'create';
};
const isUpdateArtifactTag = (openingTag) => {
    const classes = getClassList(openingTag);
    if (classes.includes('memori-artifact-update'))
        return true;
    if (!classes.includes('memori-artifact'))
        return false;
    return getDataAction(openingTag) === 'update';
};
const findMatchingOutputClose = (cleaned, openEnd) => {
    let depth = 1;
    let pos = openEnd;
    let closeStart = -1;
    while (pos < cleaned.length && depth > 0) {
        const nextOpen = cleaned.indexOf('<output', pos);
        const nextClose = cleaned.indexOf('</output>', pos);
        if (nextClose === -1) {
            return cleaned.length;
        }
        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            pos = nextOpen + '<output'.length;
        }
        else {
            depth--;
            if (depth === 0) {
                closeStart = nextClose;
            }
            else {
                pos = nextClose + '</output>'.length;
            }
        }
    }
    return closeStart;
};
const detectArtifacts = (text, isFromUser, messageKey) => {
    var _a, _b;
    if (!text || isFromUser)
        return [];
    const cleaned = (0, utils_1.stripReasoningTags)(text);
    const artifacts = [];
    let searchFrom = 0;
    let artifactNum = 0;
    const OPEN_TAG_RE = /<output\b([^>]*)>/gi;
    while (searchFrom < cleaned.length) {
        OPEN_TAG_RE.lastIndex = searchFrom;
        const openMatch = OPEN_TAG_RE.exec(cleaned);
        if (!openMatch)
            break;
        const fullOpenTag = openMatch[0];
        const openEnd = openMatch.index + fullOpenTag.length;
        if (!isCreateArtifactTag(fullOpenTag)) {
            searchFrom = openEnd;
            continue;
        }
        const closeStart = findMatchingOutputClose(cleaned, openEnd);
        if (closeStart === -1) {
            searchFrom = openEnd;
            continue;
        }
        const content = cleaned.slice(openEnd, closeStart).trim();
        const mimeTypeMatch = fullOpenTag.match(/data-mimetype\s*=\s*["']([^"']+)["']/i);
        const mimeType = ((_a = mimeTypeMatch === null || mimeTypeMatch === void 0 ? void 0 : mimeTypeMatch[1]) === null || _a === void 0 ? void 0 : _a.trim()) || 'text/plain';
        const dataTitleMatch = fullOpenTag.match(/data-title\s*=\s*["']([^"']+)["']/i);
        const htmlTitleMatch = content.match(/<title>([^<]+)<\/title>/i);
        const title = (dataTitleMatch === null || dataTitleMatch === void 0 ? void 0 : dataTitleMatch[1]) ||
            (htmlTitleMatch === null || htmlTitleMatch === void 0 ? void 0 : htmlTitleMatch[1]) ||
            `${mimeType.toUpperCase()} Artifact`;
        artifactNum++;
        const dataArtifactIdMatch = fullOpenTag.match(/data-artifact-id\s*=\s*["']([^"']+)["']/i);
        const artifactId = ((_b = dataArtifactIdMatch === null || dataArtifactIdMatch === void 0 ? void 0 : dataArtifactIdMatch[1]) === null || _b === void 0 ? void 0 : _b.trim()) ||
            `artifact-${messageKey}-${artifactNum}`;
        artifacts.push({
            id: `artifact-ui-${artifactId}`,
            artifactId,
            content,
            mimeType,
            title,
            timestamp: new Date(),
            size: content.length,
        });
        searchFrom =
            closeStart === cleaned.length
                ? cleaned.length
                : closeStart + '</output>'.length;
    }
    return artifacts;
};
const detectUpdates = (text, isFromUser) => {
    var _a;
    if (!text || isFromUser)
        return [];
    const cleaned = (0, utils_1.stripReasoningTags)(text);
    const updates = [];
    let searchFrom = 0;
    const OPEN_TAG_RE = /<output\b([^>]*)>/gi;
    while (searchFrom < cleaned.length) {
        OPEN_TAG_RE.lastIndex = searchFrom;
        const openMatch = OPEN_TAG_RE.exec(cleaned);
        if (!openMatch)
            break;
        const fullOpenTag = openMatch[0];
        const openEnd = openMatch.index + fullOpenTag.length;
        if (!isUpdateArtifactTag(fullOpenTag)) {
            searchFrom = openEnd;
            continue;
        }
        const closeStart = cleaned.indexOf('</output>', openEnd);
        const bodyEnd = closeStart === -1 ? cleaned.length : closeStart;
        const body = cleaned.slice(openEnd, bodyEnd).trim();
        const idMatch = fullOpenTag.match(/data-artifact-id\s*=\s*["']([^"']+)["']/i);
        const artifactId = (_a = idMatch === null || idMatch === void 0 ? void 0 : idMatch[1]) === null || _a === void 0 ? void 0 : _a.trim();
        const edits = (0, applyEdits_1.parseEdits)(body);
        if (artifactId && edits) {
            updates.push({ artifactId, edits });
        }
        else if (artifactId) {
            updates.push({ artifactId, edits: [] });
        }
        searchFrom =
            closeStart === -1 ? cleaned.length : closeStart + '</output>'.length;
    }
    return updates;
};
const ArtifactHandler = ({ isChatlogPanel = false, message, }) => {
    var _a;
    const { openArtifact, state, closeArtifact, registerArtifact, applyArtifactUpdate, } = (0, ArtifactContext_1.useArtifact)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const messageText = (0, react_1.useMemo)(() => message.text || '', [message.text]);
    const translatedMessageText = (0, react_1.useMemo)(() => message.translatedText || '', [message.translatedText]);
    const messageKey = (0, react_1.useMemo)(() => `${message.timestamp}-${message.fromUser ? '1' : '0'}`, [message.timestamp, message.fromUser]);
    const dispatchArtifactCreatedEvent = (0, react_1.useCallback)((artifact) => {
        const event = new CustomEvent('artifactCreated', {
            detail: { artifact, message },
        });
        document.dispatchEvent(event);
    }, [message]);
    const artifacts = (0, react_1.useMemo)(() => {
        const fromUser = message.fromUser || false;
        const primary = detectArtifacts(messageText, fromUser, messageKey);
        if (primary.length > 0)
            return primary;
        return detectArtifacts(translatedMessageText, fromUser, messageKey);
    }, [messageText, translatedMessageText, message.fromUser, messageKey]);
    const detectedUpdates = (0, react_1.useMemo)(() => {
        const fromUser = message.fromUser || false;
        const primary = detectUpdates(messageText, fromUser);
        if (primary.length > 0)
            return primary;
        return detectUpdates(translatedMessageText, fromUser);
    }, [messageText, translatedMessageText, message.fromUser]);
    const [updateResultMap, setUpdateResultMap] = (0, react_1.useState)({});
    const [failedUpdates, setFailedUpdates] = (0, react_1.useState)([]);
    const processedUpdatesRef = (0, react_1.useRef)('');
    const hasAutoOpenedRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(() => {
        if (!messageText && !translatedMessageText)
            return;
        artifacts.forEach(artifact => {
            registerArtifact(artifact);
            dispatchArtifactCreatedEvent(artifact);
        });
        const updatesSignature = `${messageKey}:${detectedUpdates
            .map(u => `${u.artifactId}:${JSON.stringify(u.edits)}`)
            .join('|')}`;
        let lastUpdated = null;
        if (detectedUpdates.length > 0 &&
            processedUpdatesRef.current !== updatesSignature) {
            processedUpdatesRef.current = updatesSignature;
            const nextMap = {};
            const nextFailed = [];
            detectedUpdates.forEach((update, idx) => {
                var _a;
                if (!update.edits.length) {
                    nextFailed.push({
                        artifactId: update.artifactId,
                        reason: 'invalid',
                    });
                    return;
                }
                const result = applyArtifactUpdate(update.artifactId, update.edits);
                if (result.updatedArtifact) {
                    nextMap[idx] = result.updatedArtifact;
                    lastUpdated = result.updatedArtifact;
                    dispatchArtifactCreatedEvent(result.updatedArtifact);
                }
                else {
                    nextFailed.push({
                        artifactId: update.artifactId,
                        reason: (_a = result.failureReason) !== null && _a !== void 0 ? _a : 'no-match',
                    });
                }
            });
            setUpdateResultMap(nextMap);
            setFailedUpdates(nextFailed);
        }
        if (isChatlogPanel)
            return;
        const openTarget = lastUpdated !== null && lastUpdated !== void 0 ? lastUpdated : (Object.keys(updateResultMap).length === 0 && artifacts.length > 0
            ? artifacts[0]
            : null);
        if (!openTarget)
            return;
        if (hasAutoOpenedRef.current === messageKey)
            return;
        hasAutoOpenedRef.current = messageKey;
        const timer = setTimeout(() => openArtifact(openTarget), 100);
        return () => clearTimeout(timer);
    }, [
        messageKey,
        messageText,
        translatedMessageText,
        artifacts,
        detectedUpdates,
        updateResultMap,
        registerArtifact,
        applyArtifactUpdate,
        dispatchArtifactCreatedEvent,
        isChatlogPanel,
        openArtifact,
    ]);
    const handleArtifactClick = (0, react_1.useCallback)((artifact) => {
        var _a;
        if (state.isDrawerOpen && ((_a = state.currentArtifact) === null || _a === void 0 ? void 0 : _a.id) === artifact.id) {
            closeArtifact();
        }
        else {
            openArtifact(artifact);
        }
    }, [state.isDrawerOpen, (_a = state.currentArtifact) === null || _a === void 0 ? void 0 : _a.id, closeArtifact, openArtifact]);
    const getIconForMimeType = (0, react_1.useCallback)((mimeType) => {
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
    }, []);
    const updatedLabel = t('artifact.updated') || 'updated';
    const updateFailedLabel = t('artifact.updateFailed') || 'Update could not be applied';
    const updateFailedHint = t('artifact.updateFailedHint') ||
        'The patch did not match the current content. Ask to rewrite the artifact.';
    const updateEntries = Object.entries(updateResultMap);
    const hasCreates = artifacts.length > 0;
    const hasUpdates = updateEntries.length > 0;
    const hasFailed = failedUpdates.length > 0;
    if (!hasCreates && !hasUpdates && !hasFailed)
        return null;
    const renderChevron = (isSelected) => {
        if (isChatlogPanel) {
            return isSelected ? ((0, jsx_runtime_1.jsx)(ChevronUp_1.default, { className: "memori-artifact-handler-action-icon" })) : ((0, jsx_runtime_1.jsx)(ChevronDown_1.default, { className: "memori-artifact-handler-action-icon" }));
        }
        return isSelected ? ((0, jsx_runtime_1.jsx)(ChevronLeft_1.default, { className: "memori-artifact-handler-action-icon" })) : ((0, jsx_runtime_1.jsx)(ChevronRight_1.default, { className: "memori-artifact-handler-action-icon" }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [artifacts.map(artifact => {
                var _a;
                const isSelected = state.isDrawerOpen && ((_a = state.currentArtifact) === null || _a === void 0 ? void 0 : _a.id) === artifact.id;
                return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: `memori-artifact-handler${isSelected ? ' memori-artifact-handler--selected' : ''}`, onClick: () => handleArtifactClick(artifact), style: isSelected
                                ? {
                                    border: '2px solid var(--memori-primary, #3b82f6)',
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                }
                                : undefined, children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-icon", children: getIconForMimeType(artifact.mimeType) }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-title", children: artifact.title }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-meta", children: [artifact.mimeType, " \u2022 ", formatBytes(artifact.size || 0)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-action", children: renderChevron(isSelected) })] }), isSelected && (0, jsx_runtime_1.jsx)(ArtifactDrawer_1.default, { isChatLogPanel: isChatlogPanel })] }, artifact.id));
            }), updateEntries.map(([, artifact]) => {
                var _a;
                const isSelected = state.isDrawerOpen && ((_a = state.currentArtifact) === null || _a === void 0 ? void 0 : _a.id) === artifact.id;
                return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: `memori-artifact-handler${isSelected ? ' memori-artifact-handler--selected' : ''}`, onClick: () => handleArtifactClick(artifact), style: isSelected
                                ? {
                                    border: '2px solid var(--memori-primary, #3b82f6)',
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                }
                                : undefined, children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-icon", children: "\u270F\uFE0F" }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-title", children: [artifact.title, " \u2014 ", updatedLabel] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-meta", children: [artifact.mimeType, " \u2022 ", formatBytes(artifact.size || 0)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-action", children: renderChevron(isSelected) })] }), isSelected && (0, jsx_runtime_1.jsx)(ArtifactDrawer_1.default, { isChatLogPanel: isChatlogPanel })] }, artifact.id));
            }), failedUpdates.map((failed, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler memori-artifact-handler--failed", style: {
                    opacity: 0.85,
                    border: '1px dashed var(--memori-danger, #ef4444)',
                    cursor: 'default',
                }, role: "status", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-icon", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-handler-title", children: updateFailedLabel }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-handler-meta", children: [failed.artifactId, " \u2022 ", updateFailedHint] })] })] }, `failed-${failed.artifactId}-${idx}`)))] }));
};
const MemoizedArtifactHandler = (0, react_1.memo)(ArtifactHandler, (prev, next) => {
    const prevText = prev.message.text || prev.message.translatedText || '';
    const nextText = next.message.text || next.message.translatedText || '';
    return (prev.isChatlogPanel === next.isChatlogPanel &&
        prevText === nextText &&
        prev.message.fromUser === next.message.fromUser &&
        prev.message.timestamp === next.message.timestamp);
});
exports.default = MemoizedArtifactHandler;
//# sourceMappingURL=ArtifactHandler.js.map