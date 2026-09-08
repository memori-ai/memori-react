"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Spin_1 = tslib_1.__importDefault(require("../../ui/Spin"));
const Image_1 = require("../../icons/Image");
const Modal_1 = tslib_1.__importDefault(require("../../ui/Modal"));
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../../ui/Button"));
const imageCompression_1 = require("../../../helpers/imageCompression");
const UploadImages = ({ authToken = '', sessionID = '', client, isMediaAccepted = false, setDocumentPreviewFiles, documentPreviewFiles, onLoadingChange, maxImages = 5, memoriID = '', onImageError, onValidateImageFile, }) => {
    var _a, _b, _c;
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const { backend, dialog } = client || {
        backend: { uploadAsset: null, uploadAssetUnlogged: null },
        dialog: { postMediumSelectedEvent: null, postMediumDeselectedEvent: null },
    };
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [loadingFileCount, setLoadingFileCount] = (0, react_1.useState)(0);
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [filePreview, setFilePreview] = (0, react_1.useState)(null);
    const [imageTitle, setImageTitle] = (0, react_1.useState)('');
    const [showUploadModal, setShowUploadModal] = (0, react_1.useState)(false);
    const imageInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (onLoadingChange) {
            onLoadingChange(isLoading, isLoading ? loadingFileCount : 0);
        }
    }, [isLoading, loadingFileCount, onLoadingChange]);
    const currentMediaCount = documentPreviewFiles.length;
    const validateImageFile = (file) => {
        if (onValidateImageFile) {
            return onValidateImageFile(file);
        }
        return true;
    };
    const handleImageUpload = async (e) => {
        var _a;
        const files = Array.from(e.target.files || []);
        if (files.length === 0)
            return;
        const remainingSlots = Math.max(0, maxImages - currentMediaCount);
        const filesToProcess = files.slice(0, remainingSlots);
        if (files.length > filesToProcess.length) {
            const skipped = files.length - filesToProcess.length;
            onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                message: (_a = t('upload.imagesNotAddedMaxAllowed', {
                    count: skipped,
                    max: maxImages,
                    defaultValue: `${skipped} image(s) not added (maximum ${maxImages} files allowed).`,
                })) !== null && _a !== void 0 ? _a : `${skipped} image(s) not added (maximum ${maxImages} files allowed).`,
                severity: 'warning',
            });
        }
        if (filesToProcess.length === 0) {
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
            return;
        }
        const validFiles = filesToProcess.filter(file => {
            if (!validateImageFile(file)) {
                return false;
            }
            return true;
        });
        if (validFiles.length === 0) {
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
            return;
        }
        if (validFiles.length === 1) {
            const file = validFiles[0];
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file));
            const fileName = file.name.split('.').slice(0, -1).join('.');
            setImageTitle(fileName);
            setShowUploadModal(true);
        }
        else {
            await uploadMultipleImages(validFiles);
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };
    const uploadMultipleImages = async (files) => {
        var _a;
        setLoadingFileCount(files.length);
        setIsLoading(true);
        try {
            const uploadPromises = files.map(async (file) => {
                let fileToUpload = file;
                try {
                    fileToUpload = await (0, imageCompression_1.compressImage)(file);
                }
                catch (error) {
                    console.warn('Image compression failed, using original file', error);
                    fileToUpload = file;
                }
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        var _a, _b, _c, _d, _e;
                        const fileDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                        const fileId = Math.random().toString(36).substr(2, 9);
                        const fileName = fileToUpload.name.split('.').slice(0, -1).join('.');
                        if (client) {
                            try {
                                let asset;
                                let response;
                                if (authToken && (backend === null || backend === void 0 ? void 0 : backend.uploadAsset)) {
                                    response = await backend.uploadAsset(fileToUpload.name, fileDataUrl, authToken);
                                }
                                else if (memoriID && sessionID && (backend === null || backend === void 0 ? void 0 : backend.uploadAssetUnlogged)) {
                                    response = await backend.uploadAssetUnlogged(fileToUpload.name, fileDataUrl, memoriID, sessionID);
                                    if (!response) {
                                        throw new Error('Upload failed');
                                    }
                                }
                                else {
                                    throw new Error('Missing required parameters for upload');
                                }
                                asset = response.asset;
                                if (response.resultCode !== 0) {
                                    throw new Error(response.resultMessage || 'Upload failed');
                                }
                                let medium = null;
                                if ((dialog === null || dialog === void 0 ? void 0 : dialog.postMediumSelectedEvent) && sessionID) {
                                    medium = await dialog.postMediumSelectedEvent(sessionID, {
                                        url: asset.assetURL,
                                        mimeType: asset.mimeType,
                                    });
                                }
                                let finalMediumID = undefined;
                                if ((_b = medium === null || medium === void 0 ? void 0 : medium.currentState) === null || _b === void 0 ? void 0 : _b.currentMedia) {
                                    const existingMediumIDs = new Set(documentPreviewFiles.map((file) => file.mediumID));
                                    finalMediumID = (_c = medium.currentState.currentMedia.find((media) => !existingMediumIDs.has(media.mediumID))) === null || _c === void 0 ? void 0 : _c.mediumID;
                                }
                                resolve({
                                    name: fileName,
                                    id: fileId,
                                    url: asset.assetURL,
                                    content: asset.assetURL,
                                    type: 'image',
                                    mediumID: finalMediumID,
                                    mimeType: asset.mimeType,
                                });
                            }
                            catch (error) {
                                onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                                    message: (_d = t('upload.uploadFailed')) !== null && _d !== void 0 ? _d : 'Upload failed',
                                    severity: 'warning',
                                });
                                resolve(null);
                            }
                        }
                        else {
                            onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                                message: (_e = t('upload.apiClientNotConfigured')) !== null && _e !== void 0 ? _e : 'API client not configured properly for media upload',
                                severity: 'warning',
                            });
                            resolve(null);
                        }
                    };
                    reader.onerror = () => {
                        var _a;
                        onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                            message: (_a = t('upload.fileReadingFailed')) !== null && _a !== void 0 ? _a : 'File reading failed',
                            severity: 'warning',
                        });
                        resolve(null);
                    };
                    reader.readAsDataURL(fileToUpload);
                });
            });
            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(result => result !== null);
            if (successfulUploads.length > 0) {
                setDocumentPreviewFiles((prevFiles) => [
                    ...prevFiles,
                    ...successfulUploads,
                ]);
            }
        }
        catch (error) {
            onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                message: (_a = t('upload.uploadFailed')) !== null && _a !== void 0 ? _a : 'Upload failed',
                severity: 'warning',
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleTitleSubmit = async () => {
        var _a;
        if (!selectedFile || !imageTitle.trim())
            return;
        setLoadingFileCount(1);
        setIsLoading(true);
        setShowUploadModal(false);
        try {
            let fileToUpload = selectedFile;
            try {
                fileToUpload = await (0, imageCompression_1.compressImage)(selectedFile);
            }
            catch (error) {
                console.warn('Image compression failed, using original file', error);
                fileToUpload = selectedFile;
            }
            const reader = new FileReader();
            reader.onload = async (e) => {
                var _a, _b, _c, _d, _e;
                const fileDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                const fileId = Math.random().toString(36).substr(2, 9);
                if (client) {
                    try {
                        let asset;
                        let response;
                        if (authToken && (backend === null || backend === void 0 ? void 0 : backend.uploadAsset)) {
                            response = await backend.uploadAsset(fileToUpload.name, fileDataUrl, authToken);
                        }
                        else if (memoriID && sessionID && (backend === null || backend === void 0 ? void 0 : backend.uploadAssetUnlogged)) {
                            response = await backend.uploadAssetUnlogged(fileToUpload.name, fileDataUrl, memoriID, sessionID);
                            if (!response) {
                                throw new Error('Upload failed');
                            }
                        }
                        else {
                            throw new Error('Missing required parameters for upload');
                        }
                        asset = response.asset;
                        if (response.resultCode !== 0) {
                            throw new Error(response.resultMessage || 'Upload failed');
                        }
                        let medium = null;
                        if ((dialog === null || dialog === void 0 ? void 0 : dialog.postMediumSelectedEvent) && sessionID) {
                            medium = await dialog.postMediumSelectedEvent(sessionID, {
                                url: asset.assetURL,
                                mimeType: asset.mimeType,
                            });
                        }
                        let finalMediumID = undefined;
                        if ((_b = medium === null || medium === void 0 ? void 0 : medium.currentState) === null || _b === void 0 ? void 0 : _b.currentMedia) {
                            const existingMediumIDs = new Set(documentPreviewFiles.map((file) => file.mediumID));
                            finalMediumID = (_c = medium.currentState.currentMedia.find((media) => !existingMediumIDs.has(media.mediumID))) === null || _c === void 0 ? void 0 : _c.mediumID;
                        }
                        setDocumentPreviewFiles((prevFiles) => [
                            ...prevFiles,
                            {
                                name: imageTitle,
                                id: fileId,
                                url: asset.assetURL,
                                content: asset.assetURL,
                                type: 'image',
                                mediumID: finalMediumID,
                                mimeType: asset.mimeType,
                            },
                        ]);
                    }
                    catch (error) {
                        onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                            message: (_d = t('upload.uploadFailed')) !== null && _d !== void 0 ? _d : 'Upload failed',
                            severity: 'warning',
                        });
                    }
                }
                else {
                    onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                        message: (_e = t('upload.apiClientNotConfigured')) !== null && _e !== void 0 ? _e : 'API client not configured properly for media upload',
                        severity: 'warning',
                    });
                }
                setIsLoading(false);
            };
            reader.onerror = () => {
                var _a;
                onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                    message: (_a = t('upload.fileReadingFailed')) !== null && _a !== void 0 ? _a : 'File reading failed',
                    severity: 'warning',
                });
                setIsLoading(false);
            };
            reader.readAsDataURL(fileToUpload);
        }
        catch (error) {
            onImageError === null || onImageError === void 0 ? void 0 : onImageError({
                message: (_a = t('upload.uploadFailed')) !== null && _a !== void 0 ? _a : 'Upload failed',
                severity: 'warning',
            });
            setIsLoading(false);
        }
    };
    const handleCancelUpload = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setFilePreview(null);
        setImageTitle('');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--image-upload-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { ref: imageInputRef, type: "file", accept: ".jpg,.jpeg,.png", multiple: true, className: "memori--upload-file-input", onChange: handleImageUpload, disabled: isLoading || !isMediaAccepted || currentMediaCount >= maxImages }), (0, jsx_runtime_1.jsx)("button", { className: (0, classnames_1.default)('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', 'memori--conversation-button', 'memori--image-upload-button'), onClick: () => { var _a; return (_a = imageInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: isLoading || !isMediaAccepted || currentMediaCount >= maxImages, children: isLoading ? ((0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: true, className: "memori--upload-icon" })) : ((0, jsx_runtime_1.jsx)(Image_1.ImageIcon, { className: "memori--upload-icon" })) }), (0, jsx_runtime_1.jsx)(Modal_1.default, { width: "80%", widthMd: "80%", open: showUploadModal && !!selectedFile, className: "memori--modal-preview-file", onClose: handleCancelUpload, closable: true, children: (0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-content", style: {
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        textAlign: 'center',
                    }, children: [filePreview && ((0, jsx_runtime_1.jsx)("img", { src: filePreview, alt: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name) || 'Preview', style: {
                                maxWidth: '100%',
                                maxHeight: '40vh',
                                marginBottom: '20px',
                            } })), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: '400px', margin: '0 auto', textAlign: 'left' }, children: [(0, jsx_runtime_1.jsx)("p", { style: { marginBottom: '10px', color: '#666' }, children: t('upload.titleHelp') }), (0, jsx_runtime_1.jsx)("input", { value: imageTitle, onChange: e => setImageTitle(e.target.value), placeholder: (_a = t('upload.titlePlaceholder')) !== null && _a !== void 0 ? _a : 'Enter image title', style: { width: '90%', marginBottom: '20px' }, className: "memori--upload-title-input" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleCancelUpload, className: "memori-button memori-button--outline memori--upload-image", children: (_b = t('cancel')) !== null && _b !== void 0 ? _b : 'Cancel' }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleTitleSubmit, disabled: !selectedFile || !imageTitle.trim(), className: "memori-button memori-button--primary memori-button--image-confirm memori--upload-image", children: (_c = t('confirm')) !== null && _c !== void 0 ? _c : 'Confirm' })] })] })] }) })] }));
};
exports.default = UploadImages;
//# sourceMappingURL=UploadImages.js.map