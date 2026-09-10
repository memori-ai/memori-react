"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Upload_1 = require("../icons/Upload");
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const Alert_1 = tslib_1.__importDefault(require("../ui/Alert"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const UploadDocuments_1 = tslib_1.__importDefault(require("./UploadDocuments/UploadDocuments"));
const UploadImages_1 = tslib_1.__importDefault(require("./UploadImages/UploadImages"));
const react_i18next_1 = require("react-i18next");
const constants_1 = require("../../helpers/constants");
const UploadButton = ({ authToken = '', client, sessionID = '', baseUrl = '', isMediaAccepted = false, setDocumentPreviewFiles, documentPreviewFiles, memoriID = '', maxTotalMessagePayload, maxDocumentsPerMessage = 10, maxDocumentContentLength = 300000, onUploadLoadingChange, }) => {
    var _a, _b;
    const effectivePerDocumentLimit = (_a = maxTotalMessagePayload !== null && maxTotalMessagePayload !== void 0 ? maxTotalMessagePayload : maxDocumentContentLength) !== null && _a !== void 0 ? _a : 300000;
    const [isDocumentLoading, setIsDocumentLoading] = (0, react_1.useState)(false);
    const [isImageLoading, setIsImageLoading] = (0, react_1.useState)(false);
    const isLoading = isDocumentLoading || isImageLoading;
    const [docUploadingCount, setDocUploadingCount] = (0, react_1.useState)(0);
    const [imgUploadingCount, setImgUploadingCount] = (0, react_1.useState)(0);
    const uploadingFileCount = docUploadingCount + imgUploadingCount;
    const [errors, setErrors] = (0, react_1.useState)([]);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const buttonRef = (0, react_1.useRef)(null);
    const documentRef = (0, react_1.useRef)(null);
    const imageRef = (0, react_1.useRef)(null);
    const unifiedInputRef = (0, react_1.useRef)(null);
    const wrapperRef = (0, react_1.useRef)(null);
    const currentMediaCount = documentPreviewFiles.length;
    const remainingSlots = maxDocumentsPerMessage - currentMediaCount;
    const hasReachedMediaLimit = remainingSlots <= 0;
    const removeError = (errorMessage) => {
        setErrors(prev => prev.filter(e => e.message !== errorMessage));
    };
    const addError = (error) => {
        setErrors(prev => [...prev, error]);
        setTimeout(() => removeError(error.message), 5000);
    };
    const isImageFile = (file) => {
        var _a;
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const imageExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = `.${(_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`;
        return imageTypes.includes(file.type) || imageExtensions.includes(fileExt);
    };
    const isDocumentFile = (file) => {
        var _a;
        const documentExtensions = [
            ...constants_1.documentConversionExtensions,
            ...constants_1.localTextExtensions,
            ...constants_1.officeNativeExtensions,
        ];
        const fileExt = `.${(_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`;
        return documentExtensions.includes(fileExt);
    };
    const isMediaAcceptedRef = (0, react_1.useRef)(isMediaAccepted);
    const currentMediaCountRef = (0, react_1.useRef)(currentMediaCount);
    const addErrorRef = (0, react_1.useRef)(addError);
    (0, react_1.useEffect)(() => {
        isMediaAcceptedRef.current = isMediaAccepted;
        currentMediaCountRef.current = currentMediaCount;
        addErrorRef.current = addError;
    }, [isMediaAccepted, currentMediaCount, addError]);
    const handleUnifiedFileSelection = (0, react_1.useCallback)((files) => {
        var _a, _b, _c, _d;
        const fileArray = Array.from(files);
        if (fileArray.length === 0)
            return;
        const supportedFiles = [];
        fileArray.forEach(file => {
            if (isImageFile(file)) {
                supportedFiles.push(file);
            }
            else if (isDocumentFile(file)) {
                supportedFiles.push(file);
            }
            else {
                addErrorRef.current({
                    message: `File "${file.name}" is not a supported image or document type`,
                    severity: 'warning',
                });
            }
        });
        const totalSupported = supportedFiles.length;
        if (totalSupported === 0)
            return;
        const remainingSlots = maxDocumentsPerMessage - currentMediaCountRef.current;
        if (remainingSlots <= 0) {
            addErrorRef.current({
                message: `Maximum ${maxDocumentsPerMessage} media files allowed.`,
                severity: 'warning',
            });
            return;
        }
        const toProcess = supportedFiles.slice(0, remainingSlots);
        const imageFiles = toProcess.filter(f => isImageFile(f));
        const documentFiles = toProcess.filter(f => isDocumentFile(f));
        if (totalSupported > remainingSlots) {
            const skipped = totalSupported - remainingSlots;
            addErrorRef.current({
                message: (_a = t('upload.filesNotAddedMaxAllowed', {
                    count: skipped,
                    max: maxDocumentsPerMessage,
                    defaultValue: `${skipped} file(s) not added (maximum ${maxDocumentsPerMessage} files allowed).`,
                })) !== null && _a !== void 0 ? _a : `${skipped} file(s) not added (maximum ${maxDocumentsPerMessage} files allowed).`,
                severity: 'warning',
            });
        }
        if (imageFiles.length > 0) {
            if (!isMediaAcceptedRef.current) {
                addErrorRef.current({
                    message: (_b = t('upload.mediaNotAccepted')) !== null && _b !== void 0 ? _b : 'Media uploads are not accepted',
                    severity: 'warning',
                });
            }
            else {
                const imageInput = (_c = imageRef.current) === null || _c === void 0 ? void 0 : _c.querySelector('input[type="file"]');
                if (imageInput) {
                    const dataTransfer = new DataTransfer();
                    imageFiles.forEach(file => {
                        try {
                            dataTransfer.items.add(file);
                        }
                        catch (err) {
                            console.warn('Failed to add image file to DataTransfer:', err);
                        }
                    });
                    if (dataTransfer.files.length > 0) {
                        try {
                            imageInput.files = dataTransfer.files;
                        }
                        catch (_e) {
                        }
                        const changeEvent = new Event('change', { bubbles: true });
                        imageInput.dispatchEvent(changeEvent);
                    }
                }
            }
        }
        if (documentFiles.length > 0) {
            setIsDocumentLoading(true);
            const documentInput = (_d = documentRef.current) === null || _d === void 0 ? void 0 : _d.querySelector('input[type="file"]');
            if (documentInput) {
                const dataTransfer = new DataTransfer();
                documentFiles.forEach(file => {
                    try {
                        dataTransfer.items.add(file);
                    }
                    catch (err) {
                        console.warn('Failed to add document file to DataTransfer:', err);
                    }
                });
                if (dataTransfer.files.length > 0) {
                    try {
                        documentInput.files = dataTransfer.files;
                    }
                    catch (_f) {
                    }
                    const changeEvent = new Event('change', { bubbles: true });
                    documentInput.dispatchEvent(changeEvent);
                }
            }
        }
    }, [t]);
    const handleButtonClick = () => {
        if (unifiedInputRef.current) {
            unifiedInputRef.current.click();
        }
    };
    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUnifiedFileSelection(files);
        }
        if (unifiedInputRef.current) {
            unifiedInputRef.current.value = '';
        }
    };
    (0, react_1.useEffect)(() => {
        const handlePaste = (e) => {
            const clipboardData = e.clipboardData;
            if (!clipboardData) {
                return;
            }
            const files = [];
            const isDuplicate = (file) => {
                return files.some(f => f.name === file.name &&
                    f.size === file.size &&
                    f.lastModified === file.lastModified);
            };
            if (clipboardData.files && clipboardData.files.length > 0) {
                const clipboardFiles = Array.from(clipboardData.files);
                clipboardFiles.forEach(file => {
                    if (!isDuplicate(file)) {
                        files.push(file);
                    }
                });
            }
            else {
                const items = clipboardData.items;
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.kind === 'file') {
                            const file = item.getAsFile();
                            if (file && !isDuplicate(file)) {
                                files.push(file);
                            }
                        }
                    }
                }
            }
            if (files.length > 0) {
                e.preventDefault();
                handleUnifiedFileSelection(files);
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [handleUnifiedFileSelection]);
    (0, react_1.useEffect)(() => {
        let dragCounter = 0;
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            if (dragCounter === 1) {
                setIsDragging(true);
            }
        };
        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter === 0) {
                setIsDragging(false);
            }
        };
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const handleDrop = (e) => {
            var _a;
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            setIsDragging(false);
            const files = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
            if (files && files.length > 0) {
                handleUnifiedFileSelection(files);
            }
        };
        document.addEventListener('dragenter', handleDragEnter);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);
        return () => {
            document.removeEventListener('dragenter', handleDragEnter);
            document.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('drop', handleDrop);
        };
    }, [handleUnifiedFileSelection]);
    const handleDocumentFiles = (files) => {
        if (files.length === 0)
            return;
        const escapeAttributeValue = (text) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
        const processedDocuments = files.map(file => {
            const escapedFileName = escapeAttributeValue(file.name);
            let formattedContent;
            if (!file.content) {
                formattedContent = `<document_attachment filename="${escapedFileName}" type="${file.mimeType}">
</document_attachment>

<attachment_link>
${file.textAssetUrl || ''}
</attachment_link>`;
            }
            else {
                const inlinedContent = file.content.length > effectivePerDocumentLimit
                    ? file.content.substring(0, effectivePerDocumentLimit) +
                        '\n\n[Content truncated due to size limits]'
                    : file.content;
                formattedContent = `<document_attachment filename="${escapedFileName}" type="${file.mimeType}">

${inlinedContent}

</document_attachment>

<attachment_link>
${file.textAssetUrl || ''}
</attachment_link>`;
            }
            return {
                name: file.name,
                id: file.id,
                content: formattedContent,
                type: 'document',
                mimeType: file.mimeType,
                url: file.textAssetUrl,
            };
        });
        setDocumentPreviewFiles((prev) => [...prev, ...processedDocuments]);
    };
    const validateDocumentFile = (file) => {
        var _a;
        const fileExt = `.${(_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`;
        const ALLOWED_FILE_TYPES = [
            ...constants_1.documentConversionExtensions,
            ...constants_1.localTextExtensions,
            ...constants_1.officeNativeExtensions,
        ];
        const MAX_FILE_SIZE = 25 * 1024 * 1024;
        if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
            addError({
                message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(', ')}`,
                severity: 'warning',
            });
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            addError({
                message: `File "${file.name}" exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
                severity: 'warning',
            });
            return false;
        }
        return true;
    };
    const validatePayloadSize = (_newDocuments) => {
        return { valid: true };
    };
    const handleDocumentError = (error) => {
        addError(error);
    };
    const validateImageFile = (file) => {
        var _a;
        const fileExt = `.${(_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`;
        const ALLOWED_FILE_TYPES = ['.jpg', '.jpeg', '.png'];
        const MAX_FILE_SIZE = 15 * 1024 * 1024;
        if (!ALLOWED_FILE_TYPES.includes(fileExt) &&
            !file.type.startsWith('image/')) {
            addError({
                message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(', ')}`,
                severity: 'warning',
            });
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            addError({
                message: `File "${file.name}" exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
                severity: 'warning',
            });
            return false;
        }
        return true;
    };
    const handleImageError = (error) => {
        addError(error);
    };
    const handleDocumentLoadingChange = (0, react_1.useCallback)((loading, fileCount) => {
        setIsDocumentLoading(loading);
        setDocUploadingCount(loading ? fileCount !== null && fileCount !== void 0 ? fileCount : 1 : 0);
    }, []);
    const handleImageLoadingChange = (0, react_1.useCallback)((loading, fileCount) => {
        setIsImageLoading(loading);
        setImgUploadingCount(loading ? fileCount !== null && fileCount !== void 0 ? fileCount : 1 : 0);
    }, []);
    (0, react_1.useEffect)(() => {
        onUploadLoadingChange === null || onUploadLoadingChange === void 0 ? void 0 : onUploadLoadingChange(isLoading, isLoading ? uploadingFileCount : 0);
    }, [isLoading, uploadingFileCount, onUploadLoadingChange]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori--unified-upload-wrapper', {
            'memori--dragging': isDragging,
        }), ref: wrapperRef, children: [(0, jsx_runtime_1.jsx)("input", { ref: unifiedInputRef, type: "file", accept: [
                    '.jpg',
                    '.jpeg',
                    '.png',
                    ...constants_1.documentConversionExtensions,
                    ...constants_1.localTextExtensions,
                    ...constants_1.officeNativeExtensions,
                ].join(','), multiple: true, className: "memori--upload-file-input", onChange: handleFileInputChange, style: { display: 'none' } }), (0, jsx_runtime_1.jsx)("button", { ref: buttonRef, className: (0, classnames_1.default)('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', 'memori--conversation-button', 'memori--unified-upload-button', { 'memori--error': errors.length > 0 }), onClick: handleButtonClick, disabled: isLoading || hasReachedMediaLimit, title: (_b = t('upload.uploadFiles', {
                    shortcut: /Mac|iPhone|iPod|iPad/i.test(navigator.platform) ||
                        navigator.userAgent.includes('Mac')
                        ? 'Cmd'
                        : 'Ctrl',
                })) !== null && _b !== void 0 ? _b : 'Upload files (drag & drop)', children: isLoading ? ((0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: true, className: "memori--upload-icon" })) : ((0, jsx_runtime_1.jsx)(Upload_1.UploadIcon, { className: "memori--upload-icon" })) }), currentMediaCount > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori--document-count', {
                    'memori--document-count-full': hasReachedMediaLimit,
                }), children: [currentMediaCount, "/", maxDocumentsPerMessage] })), (0, jsx_runtime_1.jsx)("div", { className: "memori--hidden-uploader", ref: documentRef, children: (0, jsx_runtime_1.jsx)(UploadDocuments_1.default, { setDocumentPreviewFiles: handleDocumentFiles, authToken: authToken, client: client, sessionID: sessionID, baseUrl: baseUrl, memoriID: memoriID, maxDocuments: maxDocumentsPerMessage, documentPreviewFiles: documentPreviewFiles, onLoadingChange: handleDocumentLoadingChange, onDocumentError: handleDocumentError, onValidateFile: validateDocumentFile, onValidatePayloadSize: validatePayloadSize }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori--hidden-uploader", ref: imageRef, children: (0, jsx_runtime_1.jsx)(UploadImages_1.default, { authToken: authToken, client: client, setDocumentPreviewFiles: setDocumentPreviewFiles, sessionID: sessionID, documentPreviewFiles: documentPreviewFiles, isMediaAccepted: isMediaAccepted, onLoadingChange: handleImageLoadingChange, maxImages: maxDocumentsPerMessage, memoriID: memoriID, onImageError: handleImageError, onValidateImageFile: validateImageFile }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori--error-message-container", children: errors.map((error, index) => ((0, jsx_runtime_1.jsx)(Alert_1.default, { className: "memori--error-message-alert", open: true, type: error.severity, title: t('upload.uploadNotification', {
                        defaultValue: 'Upload notification',
                    }), description: error.message, onClose: () => removeError(error.message), width: "350px" }, `${error.message}-${index}`))) })] }));
};
exports.default = UploadButton;
//# sourceMappingURL=UploadButton.js.map