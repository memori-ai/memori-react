import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import cx from 'classnames';
import Spin from '../../ui/Spin';
import { DocumentIcon } from '../../icons/Document';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import { documentConversionExtensions, localTextExtensions, officeNativeExtensions, } from '../../../helpers/constants';
import { isLocalTextFilename, isOfficeNativeFilename, } from '../../../helpers/utils';
import { convertDocument } from '../../../helpers/convertDocument';
const UploadDocuments = ({ setDocumentPreviewFiles, authToken = '', client, sessionID = '', baseUrl = '', memoriID = '', maxDocuments, documentPreviewFiles, onLoadingChange, onDocumentError, onValidateFile, onValidatePayloadSize, }) => {
    const { t } = useTranslation();
    const { backend } = client || {
        backend: { uploadAsset: null, uploadAssetUnlogged: null },
    };
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const documentInputRef = useRef(null);
    const setLoadingState = (loading, fileCount) => {
        setIsLoading(loading);
        onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(loading, fileCount);
    };
    const validateDocumentFile = (file) => {
        if (onValidateFile) {
            return onValidateFile(file);
        }
        return true;
    };
    const validatePayloadSize = (newDocuments) => {
        if (onValidatePayloadSize) {
            const result = onValidatePayloadSize(newDocuments);
            if (typeof result === 'boolean') {
                return result ? { valid: true } : { valid: false, message: '' };
            }
            return result;
        }
        return { valid: true };
    };
    const processDocumentFile = async (file) => {
        if (isOfficeNativeFilename(file.name)) {
            return { text: null, uploadAsOriginal: true };
        }
        try {
            const text = isLocalTextFilename(file.name)
                ? await fileToText(file)
                : await convertDocument(file, sessionID, baseUrl);
            return { text };
        }
        catch (error) {
            console.error('Document processing failed:', error);
            throw new Error(`Failed to process "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    const fileToText = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => { var _a; return resolve(((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || ''); };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsText(file, 'UTF-8');
    });
    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => { var _a; return resolve(((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || ''); };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsDataURL(file);
    });
    const uploadAssetFile = async (file) => {
        var _a;
        if (!client) {
            throw new Error('API client not configured properly for media upload');
        }
        const fileDataUrl = await fileToDataUrl(file);
        let response;
        if (authToken && (backend === null || backend === void 0 ? void 0 : backend.uploadAsset)) {
            response = await backend.uploadAsset(file.name, fileDataUrl, authToken);
        }
        else if (memoriID && sessionID && (backend === null || backend === void 0 ? void 0 : backend.uploadAssetUnlogged)) {
            response = await backend.uploadAssetUnlogged(file.name, fileDataUrl, memoriID, sessionID);
        }
        else {
            throw new Error('Missing required parameters for upload');
        }
        if (!response) {
            throw new Error('Upload failed');
        }
        if (response.resultCode !== 0) {
            throw new Error(response.resultMessage || 'Upload failed');
        }
        const assetURL = (_a = response.asset) === null || _a === void 0 ? void 0 : _a.assetURL;
        if (!assetURL) {
            throw new Error('Upload failed: missing asset URL');
        }
        return assetURL;
    };
    const handleDocumentUpload = async (e) => {
        var _a;
        const files = Array.from(e.target.files || []);
        if (files.length === 0)
            return;
        const currentMediaCount = documentPreviewFiles.length;
        const remainingSlots = maxDocuments
            ? Math.max(0, maxDocuments - currentMediaCount)
            : files.length;
        const filesToProcess = files.slice(0, remainingSlots);
        if (files.length > filesToProcess.length) {
            const skipped = files.length - filesToProcess.length;
            onDocumentError === null || onDocumentError === void 0 ? void 0 : onDocumentError({
                message: (_a = t('upload.documentsNotAddedMaxAllowed', {
                    count: skipped,
                    max: maxDocuments !== null && maxDocuments !== void 0 ? maxDocuments : 10,
                    defaultValue: `${skipped} document(s) not added (maximum ${maxDocuments !== null && maxDocuments !== void 0 ? maxDocuments : 10} files allowed).`,
                })) !== null && _a !== void 0 ? _a : `${skipped} document(s) not added (maximum ${maxDocuments !== null && maxDocuments !== void 0 ? maxDocuments : 10} files allowed).`,
                severity: 'warning',
            });
        }
        if (filesToProcess.length === 0) {
            if (documentInputRef.current) {
                documentInputRef.current.value = '';
            }
            return;
        }
        setLoadingState(true, filesToProcess.length);
        try {
            const processedFiles = [];
            let activeCount = filesToProcess.length;
            for (const file of filesToProcess) {
                if (!validateDocumentFile(file)) {
                    activeCount--;
                    onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(true, activeCount);
                    continue;
                }
                const fileId = Math.random().toString(36).substr(2, 9);
                try {
                    const { text, uploadAsOriginal } = await processDocumentFile(file);
                    if (uploadAsOriginal) {
                        let assetUrl;
                        try {
                            assetUrl = await uploadAssetFile(file);
                        }
                        catch (uploadError) {
                            console.error('Office asset upload failed:', uploadError);
                            onDocumentError === null || onDocumentError === void 0 ? void 0 : onDocumentError({
                                message: t('upload.officeAssetUploadFailed', {
                                    fileName: file.name,
                                    defaultValue: `"${file.name}" could not be uploaded and was not added.`,
                                }),
                                severity: 'error',
                            });
                        }
                        if (!assetUrl) {
                            activeCount--;
                            onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(true, activeCount);
                            continue;
                        }
                        processedFiles.push({
                            name: file.name,
                            id: fileId,
                            content: '',
                            mimeType: file.type,
                            textAssetUrl: assetUrl,
                        });
                    }
                    else if (text) {
                        const baseName = file.name.replace(/\.[^/.]+$/, '') || file.name;
                        const textFile = new File([text], `${baseName}.txt`, {
                            type: 'text/plain',
                        });
                        let textAssetUrl;
                        try {
                            textAssetUrl = await uploadAssetFile(textFile);
                        }
                        catch (uploadError) {
                            console.error('Text asset upload failed:', uploadError);
                            onDocumentError === null || onDocumentError === void 0 ? void 0 : onDocumentError({
                                message: t('upload.partialAssetUploadWarning', {
                                    fileName: file.name,
                                    defaultValue: 'Some file links could not be uploaded, but the document was added anyway.',
                                }),
                                severity: 'warning',
                            });
                        }
                        processedFiles.push({
                            name: file.name,
                            id: fileId,
                            content: text,
                            mimeType: file.type,
                            textAssetUrl,
                        });
                    }
                    else {
                        activeCount--;
                        onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(true, activeCount);
                    }
                }
                catch (error) {
                    activeCount--;
                    onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(true, activeCount);
                    console.error('File processing error:', error);
                    onDocumentError === null || onDocumentError === void 0 ? void 0 : onDocumentError({
                        message: `${error instanceof Error ? error.message : 'Unknown error'}`,
                        severity: 'warning',
                    });
                }
            }
            if (processedFiles.length > 0) {
                setDocumentPreviewFiles(processedFiles.map(file => ({
                    ...file,
                    type: 'document',
                })));
            }
        }
        finally {
            setLoadingState(false);
            if (documentInputRef.current) {
                documentInputRef.current.value = '';
            }
        }
    };
    return (_jsxs("div", { className: "memori--document-upload-wrapper", children: [_jsx("input", { ref: documentInputRef, type: "file", accept: [
                    ...documentConversionExtensions,
                    ...localTextExtensions,
                    ...officeNativeExtensions,
                ].join(','), multiple: true, className: "memori--upload-file-input", onChange: handleDocumentUpload }), _jsx("button", { className: cx('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', 'memori--conversation-button', 'memori--document-upload-button', { 'memori--error': false }), onClick: () => { var _a; return (_a = documentInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: isLoading ||
                    (maxDocuments && documentPreviewFiles.length >= maxDocuments) ||
                    false, title: "Upload documents", children: isLoading ? (_jsx(Spin, { spinning: true, className: "memori--upload-icon" })) : (_jsx(React.Fragment, { children: _jsx(DocumentIcon, { className: "memori--upload-icon" }) })) }), _jsx(Modal, { width: "80%", widthMd: "80%", open: !!selectedFile, className: "memori--modal-preview-file", onClose: () => setSelectedFile(null), closable: true, title: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name, children: _jsx("div", { className: "memori--preview-content", style: {
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                    }, children: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content }) })] }));
};
export default UploadDocuments;
//# sourceMappingURL=UploadDocuments.js.map