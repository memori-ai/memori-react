import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Send from '../icons/Send';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import cx from 'classnames';
import Microphone from '../icons/Microphone';
import UploadButton from '../UploadButton/UploadButton';
import FilePreview from '../FilePreview/FilePreview';
const ChatInputs = ({ dialogState, userMessage = '', sendOnEnter, onChangeUserMessage, sendMessage, onTextareaFocus, onTextareaBlur, showMicrophone = false, microphoneMode = 'HOLD_TO_TALK', listening = false, stopAudio, startListening, stopListening, showUpload = false, isTyping = false, sessionID, authToken, memoriID, baseUrl, client, onTextareaExpanded, maxTotalMessagePayload, maxTextareaCharacters, maxDocumentsPerMessage, maxDocumentContentLength, pasteAsCardLineThreshold, pasteAsCardCharThreshold, }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(0);
    const handleUploadLoadingChange = useCallback((loading, fileCount) => {
        setUploadingCount(loading ? fileCount !== null && fileCount !== void 0 ? fileCount : 1 : 0);
    }, []);
    const [documentPreviewFiles, setDocumentPreviewFiles] = useState([]);
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
    const handleTextareaPaste = useCallback((e) => {
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
            toast(t('upload.pasteContentExceedsLimit', {
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
            toast.error(t('upload.pasteMaxAttachmentsReached', {
                max: maxDocs,
                defaultValue: `Maximum ${maxDocs} attachments. Remove one to add this as a file.`,
            }));
            return;
        }
        const perDocumentLimit = (_b = maxTotalMessagePayload !== null && maxTotalMessagePayload !== void 0 ? maxTotalMessagePayload : maxDocumentContentLength) !== null && _b !== void 0 ? _b : 300000;
        if (text.length > perDocumentLimit) {
            e.preventDefault();
            toast(t('upload.pasteContentExceedsLimit', {
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
    return (_jsxs("div", { className: "memori-chat-inputs-wrapper", children: [_jsxs("fieldset", { id: "chat-fieldset", className: cx('memori-chat-inputs', {
                    'memori-chat-inputs--expanded': isExpanded,
                }), disabled: isDisabled, children: [(showUpload || documentPreviewFiles.length > 0 || uploadingCount > 0) && (_jsx("div", { className: "memori-chat-inputs--preview-wrapper", children: _jsx(FilePreview, { previewFiles: documentPreviewFiles, removeFile: removeFile, showAnonymousRetentionNotice: !authToken, uploadingCount: uploadingCount }) })), _jsxs("div", { className: "memori-chat-inputs--container", children: [_jsx("div", { className: "memori-chat-inputs--leading", children: showUpload && (_jsx("div", { className: "memori-chat-inputs--upload-wrapper", children: _jsx(UploadButton, { authToken: authToken, client: client, sessionID: sessionID, baseUrl: baseUrl, isMediaAccepted: (dialogState === null || dialogState === void 0 ? void 0 : dialogState.acceptsMedia) || false, setDocumentPreviewFiles: setDocumentPreviewFiles, documentPreviewFiles: documentPreviewFiles, memoriID: memoriID, maxTotalMessagePayload: maxTotalMessagePayload, maxDocumentsPerMessage: maxDocumentsPerMessage, maxDocumentContentLength: maxDocumentContentLength, onUploadLoadingChange: handleUploadLoadingChange }) })) }), _jsx("div", { className: "memori-chat-inputs--primary", children: _jsx(ChatTextArea, { value: userMessage, onChange: onChangeUserMessage, onPressEnter: onTextareaPressEnter, onPaste: handleTextareaPaste, onFocus: onTextareaFocus, onBlur: onTextareaBlur, onExpandedChange: handleTextareaExpanded, disabled: textareaDisabled, maxTextareaCharacters: maxTextareaCharacters }) }), _jsx("div", { className: "memori-chat-inputs--trailing", children: _jsxs("div", { className: "memori-chat-inputs--trailing-inner", children: [showMicrophone && microphoneMode === 'CONTINUOUS' && (_jsx("button", { type: "button", className: cx('memori-chat-inputs--mic-btn', {
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
                                                    'Start listening', children: _jsx(Microphone, { className: "icon" }) })), showMicrophone && microphoneMode === 'HOLD_TO_TALK' && (_jsx(MicrophoneButton, { listening: listening, startListening: startListening, stopListening: () => {
                                                stopListening();
                                                if (listening && !!(userMessage === null || userMessage === void 0 ? void 0 : userMessage.length)) {
                                                    sendMessage(userMessage);
                                                }
                                            }, stopAudio: stopAudio })), _jsx("button", { type: "button", className: cx('memori-chat-inputs--send-btn', {
                                                'memori-chat-inputs--send-btn--active': !!(userMessage === null || userMessage === void 0 ? void 0 : userMessage.length),
                                                'memori-chat-inputs--send-btn--disabled': !userMessage || userMessage.length === 0,
                                            }), onClick: () => {
                                                onSendMessage(documentPreviewFiles);
                                            }, disabled: !userMessage || userMessage.length === 0 || isTyping || uploadingCount > 0, title: t('send') || 'Send', "aria-label": t('send') || 'Send', children: isTyping ? (_jsx("div", { className: "memori-chat-inputs--send-btn--loading" })) : (_jsx(Send, { className: "icon" })) })] }) })] })] }), _jsx("div", { className: "memori-chat-inputs--disclaimer", children: _jsx("div", { className: "memori-chat-inputs--disclaimer-text", children: t('write_and_speak.aiDisclaimer', "L'agente può commettere errori. Assicurati di verificare le risposte.") }) })] }));
};
export default ChatInputs;
//# sourceMappingURL=ChatInputs.js.map