"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const File_1 = tslib_1.__importDefault(require("../icons/File"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const ContentPreviewModal_1 = tslib_1.__importDefault(require("../ContentPreviewModal"));
const Snippet_1 = tslib_1.__importDefault(require("../Snippet/Snippet"));
const utils_1 = require("../../helpers/utils");
const MediaItemWidget_utils_1 = require("../MediaWidget/MediaItemWidget.utils");
const react_i18next_1 = require("react-i18next");
const FilePreview = ({ previewFiles, removeFile, allowRemove = true, showAnonymousRetentionNotice = false, uploadingCount = 0, }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const getFileType = (filename, type) => {
        var _a, _b;
        if (type === 'image') {
            const extension = (_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            switch (extension) {
                case 'jpg':
                case 'jpeg':
                    return 'JPEG';
                case 'png':
                    return 'PNG';
                default:
                    return 'Image';
            }
        }
        const extension = (_b = filename.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'PDF';
            case 'txt':
                return 'Text';
            case 'json':
                return 'JSON';
            case 'xlsx':
                return 'Excel';
            case 'csv':
                return 'CSV';
            case 'html':
                return 'HTML';
            case 'doc':
            case 'docx':
            case 'dotx':
                return 'Word';
            case 'xls':
            case 'xltx':
                return 'Excel';
            case 'potx':
                return 'PowerPoint';
            case 'jpg':
            case 'jpeg':
                return 'JPEG';
            case 'png':
                return 'PNG';
            default:
                return 'Document';
        }
    };
    (0, react_1.useEffect)(() => {
        const chat = document.getElementsByClassName('memori-chat--content');
        if (chat) {
            const lastChild = chat[chat.length - 1];
            if (lastChild) {
                chat[0].scrollTo({
                    top: chat[0].scrollHeight,
                    behavior: 'smooth',
                });
            }
        }
    }, [previewFiles]);
    const isHtmlFile = (file) => {
        var _a, _b;
        if (!file)
            return false;
        const ext = (_b = (_a = file.name) === null || _a === void 0 ? void 0 : _a.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        return ((file.type === 'document' &&
            (ext === 'html' || file.mimeType === 'text/html')) ||
            ext === 'html' ||
            file.mimeType === 'text/html');
    };
    const getDisplayContent = (file) => {
        if (!(file === null || file === void 0 ? void 0 : file.content))
            return '';
        const content = file.content;
        if (isHtmlFile(file)) {
            let htmlContent = content;
            if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
                htmlContent = (0, utils_1.stripHTML)(htmlContent) || htmlContent;
            }
            htmlContent = (0, utils_1.stripDocumentAttachmentTags)(htmlContent);
            return htmlContent;
        }
        return (0, utils_1.stripHTML)((0, utils_1.stripDocumentAttachmentTags)(content));
    };
    const isImageContent = (content, type) => {
        if (type === 'image')
            return true;
        const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content);
        const isImageUrl = content.startsWith('http') &&
            (content.includes('/image/') ||
                content.includes('/img/') ||
                hasImageExtension);
        return isImageUrl || hasImageExtension;
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(previewFiles.length > 0 || uploadingCount > 0) && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-container", children: [showAnonymousRetentionNotice && ((0, jsx_runtime_1.jsx)("small", { style: {
                            color: 'rgb(138, 138, 138)',
                            display: 'block',
                            marginTop: '6px',
                            marginBottom: '6px',
                            fontSize: '0.7rem',
                        }, children: t('upload.anonymousRetentionNotice', {
                            defaultValue: 'Note: uploaded files are retained for a maximum of 24 hours.',
                        }) })), (0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-list", children: [previewFiles.map((file) => ((0, jsx_runtime_1.jsxs)("div", { className: `memori--preview-item ${isImageContent(file.content, file.type)
                                    ? 'memori--preview-item--image'
                                    : 'memori--preview-item--document'}`, onClick: () => {
                                    if ((0, utils_1.isOfficeNativeFilename)(file.name || '')) {
                                        const url = (0, utils_1.getDocumentAttachmentAssetUrl)(file);
                                        if (url) {
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }
                                    }
                                    else {
                                        setSelectedFile(file);
                                    }
                                }, children: [isImageContent(file.content, file.type) ? ((0, jsx_runtime_1.jsx)("div", { className: "memori--preview-thumbnail", children: (0, jsx_runtime_1.jsx)("img", { src: file.content, alt: file.name }) })) : ((0, jsx_runtime_1.jsx)(File_1.default, { className: "memori--preview-icon" })), (0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-file-info", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--preview-filename", children: file.name }), (0, jsx_runtime_1.jsx)("span", { className: "memori--preview-filetype", children: file.mimeType
                                                    ? (0, MediaItemWidget_utils_1.getDocumentBadgeLabel)(file.mimeType, file.name)
                                                    : getFileType(file.name, file.type) })] }), allowRemove && ((0, jsx_runtime_1.jsx)(Button_1.default, { shape: "rounded", icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), danger: true, className: "memori--remove-button", onClick: e => {
                                            e.stopPropagation();
                                            removeFile(file.id, file === null || file === void 0 ? void 0 : file.mediumID);
                                        } }))] }, file.id))), uploadingCount > 0 &&
                                Array.from({ length: uploadingCount }, (_, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-item memori--preview-item--document memori--preview-item--skeleton", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--skeleton-icon" }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--preview-file-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--skeleton-line memori--skeleton-line--name" }), (0, jsx_runtime_1.jsx)("div", { className: "memori--skeleton-line memori--skeleton-line--type" })] })] }, `skeleton-${i}`)))] })] })), (0, jsx_runtime_1.jsx)(ContentPreviewModal_1.default, { open: !!selectedFile, onClose: () => setSelectedFile(null), title: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name, isImage: !!selectedFile &&
                    isImageContent(selectedFile.content, selectedFile.type), imageSrc: selectedFile &&
                    isImageContent(selectedFile.content, selectedFile.type)
                    ? selectedFile.content
                    : undefined, imageAlt: (_a = selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name) !== null && _a !== void 0 ? _a : '', children: selectedFile &&
                    !isImageContent(selectedFile.content, selectedFile.type) &&
                    (isHtmlFile(selectedFile) ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: {
                            mediumID: selectedFile.id,
                            mimeType: 'application/xml',
                            content: getDisplayContent(selectedFile),
                            title: selectedFile.name,
                        } })) : (getDisplayContent(selectedFile))) })] }));
};
exports.default = FilePreview;
//# sourceMappingURL=FilePreview.js.map