"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const ChatTextArea_1 = tslib_1.__importDefault(require("../ChatTextArea/ChatTextArea"));
const Send_1 = tslib_1.__importDefault(require("../icons/Send"));
const MicrophoneButton_1 = tslib_1.__importDefault(require("../MicrophoneButton/MicrophoneButton"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Microphone_1 = tslib_1.__importDefault(require("../icons/Microphone"));
const UploadButton_1 = tslib_1.__importDefault(require("../UploadButton/UploadButton"));
const FilePreview_1 = tslib_1.__importDefault(require("../FilePreview/FilePreview"));
const ChatInputs = ({ dialogState, userMessage = '', sendOnEnter, onChangeUserMessage, sendMessage, onTextareaFocus, onTextareaBlur, showMicrophone = false, microphoneMode = 'HOLD_TO_TALK', listening = false, stopAudio, startListening, stopListening, showUpload = false, isTyping = false, sessionID, authToken, memoriID, baseUrl, client, onTextareaExpanded, maxTotalMessagePayload, maxTextareaCharacters, maxDocumentsPerMessage, maxDocumentContentLength, pasteAsCardLineThreshold, pasteAsCardCharThreshold, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const [uploadingCount, setUploadingCount] = (0, react_1.useState)(0);
    const handleUploadLoadingChange = (0, react_1.useCallback)((loading, fileCount) => {
        setUploadingCount(loading ? fileCount !== null && fileCount !== void 0 ? fileCount : 1 : 0);
    }, []);
    const [documentPreviewFiles, setDocumentPreviewFiles] = (0, react_1.useState)([]);
    const { dialog } = client || {
        dialog: { postMediumDeselectedEvent: null },
    };
    const onSendMessage = (files) => {
        if (isTyping)
            return;
        const mediaWithIds = files.map((file, index) => {
            const generatedMediumID = file.mediumID ||
                `file_${Date.now()}_${index}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`;
            return {
                mediumID: generatedMediumID,
                mimeType: file.mimeType,
                content: file.content,
                title: file.name,
                properties: { isAttachedFile: true },
                type: file.type,
                url: file.url,
            };
        });
        sendMessage(userMessage, mediaWithIds);
        setDocumentPreviewFiles([]);
        stopAudio();
        speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    };
    const onTextareaPressEnter = (e) => {
        if (e.altKey)
            return;
        e.preventDefault();
        if (isTyping)
            return;
        if (sendOnEnter === 'keypress' && (userMessage === null || userMessage === void 0 ? void 0 : userMessage.length) > 0) {
            stopListening();
            const mediaWithIds = documentPreviewFiles.map((file, index) => {
                const generatedMediumID = file.mediumID ||
                    `file_${Date.now()}_${index}_${Math.random()
                        .toString(36)
                        .substr(2, 9)}`;
                return {
                    mediumID: generatedMediumID,
                    mimeType: file.mimeType,
                    content: file.content,
                    title: file.name,
                    properties: { isAttachedFile: true },
                    type: file.type,
                    url: file.url,
                };
            });
            sendMessage(userMessage, mediaWithIds);
            setDocumentPreviewFiles([]);
            onChangeUserMessage('');
        }
    };
    const removeFile = async (fileId, mediumID) => {
        if (dialog.postMediumDeselectedEvent && sessionID && mediumID) {
            await dialog.postMediumDeselectedEvent(sessionID, mediumID);
        }
        setDocumentPreviewFiles((prev) => prev.filter((file) => file.id !== fileId));
    };
    const handleTextareaExpanded = (expanded) => {
        setIsExpanded(expanded);
        if (onTextareaExpanded) {
            onTextareaExpanded(expanded);
        }
    };
    const handleTextareaPaste = (0, react_1.useCallback)((e) => {
        var _a, _b;
        if ((_a = e.clipboardData.files) === null || _a === void 0 ? void 0 : _a.length)
            return;
        const text = e.clipboardData.getData('text/plain');
        if (!(text === null || text === void 0 ? void 0 : text.trim()))
            return;
        const target = e.target;
        const selectionLength = target.selectionEnd - target.selectionStart;
        const lengthAfterPaste = userMessage.length - selectionLength + text.length;
        if (maxTextareaCharacters != null &&
            lengthAfterPaste > maxTextareaCharacters) {
            e.preventDefault();
            (0, react_hot_toast_1.default)(t('upload.pasteContentExceedsLimit', {
                defaultValue: 'Pasted content exceeds the size limit. Try shortening the text or splitting it into smaller parts.',
            }), { icon: '⚠️' });
            return;
        }
        const lineCount = text.split(/\r?\n/).length;
        const charThreshold = pasteAsCardCharThreshold !== null && pasteAsCardCharThreshold !== void 0 ? pasteAsCardCharThreshold : 4200;
        const lineThreshold = pasteAsCardLineThreshold !== null && pasteAsCardLineThreshold !== void 0 ? pasteAsCardLineThreshold : 100;
        const exceedsCharThreshold = text.length > charThreshold;
        const exceedsLineThreshold = lineCount > lineThreshold;
        if (!exceedsCharThreshold && !exceedsLineThreshold) {
            return;
        }
        const maxDocs = maxDocumentsPerMessage !== null && maxDocumentsPerMessage !== void 0 ? maxDocumentsPerMessage : 10;
        if (documentPreviewFiles.length >= maxDocs) {
            e.preventDefault();
            react_hot_toast_1.default.error(t('upload.pasteMaxAttachmentsReached', {
                max: maxDocs,
                defaultValue: `Maximum ${maxDocs} attachments. Remove one to add this as a file.`,
            }));
            return;
        }
        const perDocumentLimit = (_b = maxTotalMessagePayload !== null && maxTotalMessagePayload !== void 0 ? maxTotalMessagePayload : maxDocumentContentLength) !== null && _b !== void 0 ? _b : 300000;
        if (text.length > perDocumentLimit) {
            e.preventDefault();
            (0, react_hot_toast_1.default)(t('upload.pasteContentExceedsLimit', {
                defaultValue: 'Pasted content exceeds the size limit. Try shortening the text or splitting it into smaller parts.',
            }), { icon: '⚠️' });
            return;
        }
        e.preventDefault();
        const displayName = t('upload.pastedText') || 'pasted-text';
        const wrappedContent = `<document_attachment filename="pasted-text.txt" type="text/plain">

${text}

</document_attachment>`;
        const newFile = {
            name: displayName,
            id: `paste_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            content: wrappedContent,
            mediumID: undefined,
            mimeType: 'text/plain',
            type: 'document',
        };
        setDocumentPreviewFiles((prev) => [...prev, newFile]);
    }, [
        documentPreviewFiles,
        maxTextareaCharacters,
        maxTotalMessagePayload,
        userMessage.length,
        t,
    ]);
    const isDisabled = (dialogState === null || dialogState === void 0 ? void 0 : dialogState.state) === 'X2a' || (dialogState === null || dialogState === void 0 ? void 0 : dialogState.state) === 'X3';
    const textareaDisabled = ['R2', 'R3', 'R4', 'R5', 'G3', 'X3'].includes((dialogState === null || dialogState === void 0 ? void 0 : dialogState.state) || '');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-inputs-wrapper", children: [(0, jsx_runtime_1.jsxs)("fieldset", { id: "chat-fieldset", className: (0, classnames_1.default)('memori-chat-inputs', {
                    'memori-chat-inputs--expanded': isExpanded,
                }), disabled: isDisabled, children: [(showUpload || documentPreviewFiles.length > 0 || uploadingCount > 0) && ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--preview-wrapper", children: (0, jsx_runtime_1.jsx)(FilePreview_1.default, { previewFiles: documentPreviewFiles, removeFile: removeFile, showAnonymousRetentionNotice: !authToken, uploadingCount: uploadingCount }) })), (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-inputs--container", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--leading", children: showUpload && ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--upload-wrapper", children: (0, jsx_runtime_1.jsx)(UploadButton_1.default, { authToken: authToken, client: client, sessionID: sessionID, baseUrl: baseUrl, isMediaAccepted: (dialogState === null || dialogState === void 0 ? void 0 : dialogState.acceptsMedia) || false, setDocumentPreviewFiles: setDocumentPreviewFiles, documentPreviewFiles: documentPreviewFiles, memoriID: memoriID, maxTotalMessagePayload: maxTotalMessagePayload, maxDocumentsPerMessage: maxDocumentsPerMessage, maxDocumentContentLength: maxDocumentContentLength, onUploadLoadingChange: handleUploadLoadingChange }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--primary", children: (0, jsx_runtime_1.jsx)(ChatTextArea_1.default, { value: userMessage, onChange: onChangeUserMessage, onPressEnter: onTextareaPressEnter, onPaste: handleTextareaPaste, onFocus: onTextareaFocus, onBlur: onTextareaBlur, onExpandedChange: handleTextareaExpanded, disabled: textareaDisabled, maxTextareaCharacters: maxTextareaCharacters }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--trailing", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-inputs--trailing-inner", children: [showMicrophone && microphoneMode === 'CONTINUOUS' && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: (0, classnames_1.default)('memori-chat-inputs--mic-btn', {
                                                'memori-chat-inputs--mic-btn--listening': listening,
                                            }), title: listening
                                                ? t('write_and_speak.micButtonPopoverListening') ||
                                                    'Listening'
                                                : t('write_and_speak.micButtonPopover') ||
                                                    'Start listening', onClick: () => {
                                                if (listening) {
                                                    stopListening();
                                                }
                                                else {
                                                    stopAudio();
                                                    startListening();
                                                }
                                            }, disabled: isDisabled, "aria-label": listening
                                                ? t('write_and_speak.micButtonPopoverListening') ||
                                                    'Listening'
                                                : t('write_and_speak.micButtonPopover') ||
                                                    'Start listening', children: (0, jsx_runtime_1.jsx)(Microphone_1.default, { className: "icon" }) })), showMicrophone && microphoneMode === 'HOLD_TO_TALK' && ((0, jsx_runtime_1.jsx)(MicrophoneButton_1.default, { listening: listening, startListening: startListening, stopListening: () => {
                                                stopListening();
                                                if (listening && !!(userMessage === null || userMessage === void 0 ? void 0 : userMessage.length)) {
                                                    sendMessage(userMessage);
                                                }
                                            }, stopAudio: stopAudio })), (0, jsx_runtime_1.jsx)("button", { type: "button", className: (0, classnames_1.default)('memori-chat-inputs--send-btn', {
                                                'memori-chat-inputs--send-btn--active': !!(userMessage === null || userMessage === void 0 ? void 0 : userMessage.length),
                                                'memori-chat-inputs--send-btn--disabled': !userMessage || userMessage.length === 0,
                                            }), onClick: () => {
                                                onSendMessage(documentPreviewFiles);
                                            }, disabled: !userMessage || userMessage.length === 0 || isTyping || uploadingCount > 0, title: t('send') || 'Send', "aria-label": t('send') || 'Send', children: isTyping ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--send-btn--loading" })) : ((0, jsx_runtime_1.jsx)(Send_1.default, { className: "icon" })) })] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--disclaimer", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-chat-inputs--disclaimer-text", children: t('write_and_speak.aiDisclaimer', "L'agente può commettere errori. Assicurati di verificare le risposte.") }) })] }));
};
exports.default = ChatInputs;
//# sourceMappingURL=ChatInputs.js.map