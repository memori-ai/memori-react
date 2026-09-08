import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import File from '../icons/File';
import CloseIcon from '../icons/Close';
import Button from '../ui/Button';
import ContentPreviewModal from '../ContentPreviewModal';
import Snippet from '../Snippet/Snippet';
import { stripHTML, stripDocumentAttachmentTags, isOfficeNativeFilename, getDocumentAttachmentAssetUrl, } from '../../helpers/utils';
import { getDocumentBadgeLabel } from '../MediaWidget/MediaItemWidget.utils';
import { useTranslation } from 'react-i18next';
const FilePreview = ({ previewFiles, removeFile, allowRemove = true, showAnonymousRetentionNotice = false, uploadingCount = 0, }) => {
    var _a;
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
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
    useEffect(() => {
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
                htmlContent = stripHTML(htmlContent) || htmlContent;
            }
            htmlContent = stripDocumentAttachmentTags(htmlContent);
            return htmlContent;
        }
        return stripHTML(stripDocumentAttachmentTags(content));
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
    return (_jsxs(_Fragment, { children: [(previewFiles.length > 0 || uploadingCount > 0) && (_jsxs("div", { className: "memori--preview-container", children: [showAnonymousRetentionNotice && (_jsx("small", { style: {
                            color: 'rgb(138, 138, 138)',
                            display: 'block',
                            marginTop: '6px',
                            marginBottom: '6px',
                            fontSize: '0.7rem',
                        }, children: t('upload.anonymousRetentionNotice', {
                            defaultValue: 'Note: uploaded files are retained for a maximum of 24 hours.',
                        }) })), _jsxs("div", { className: "memori--preview-list", children: [previewFiles.map((file) => (_jsxs("div", { className: `memori--preview-item ${isImageContent(file.content, file.type)
                                    ? 'memori--preview-item--image'
                                    : 'memori--preview-item--document'}`, onClick: () => {
                                    if (isOfficeNativeFilename(file.name || '')) {
                                        const url = getDocumentAttachmentAssetUrl(file);
                                        if (url) {
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }
                                    }
                                    else {
                                        setSelectedFile(file);
                                    }
                                }, children: [isImageContent(file.content, file.type) ? (_jsx("div", { className: "memori--preview-thumbnail", children: _jsx("img", { src: file.content, alt: file.name }) })) : (_jsx(File, { className: "memori--preview-icon" })), _jsxs("div", { className: "memori--preview-file-info", children: [_jsx("span", { className: "memori--preview-filename", children: file.name }), _jsx("span", { className: "memori--preview-filetype", children: file.mimeType
                                                    ? getDocumentBadgeLabel(file.mimeType, file.name)
                                                    : getFileType(file.name, file.type) })] }), allowRemove && (_jsx(Button, { shape: "rounded", icon: _jsx(CloseIcon, {}), danger: true, className: "memori--remove-button", onClick: e => {
                                            e.stopPropagation();
                                            removeFile(file.id, file === null || file === void 0 ? void 0 : file.mediumID);
                                        } }))] }, file.id))), uploadingCount > 0 &&
                                Array.from({ length: uploadingCount }, (_, i) => (_jsxs("div", { className: "memori--preview-item memori--preview-item--document memori--preview-item--skeleton", children: [_jsx("div", { className: "memori--skeleton-icon" }), _jsxs("div", { className: "memori--preview-file-info", children: [_jsx("div", { className: "memori--skeleton-line memori--skeleton-line--name" }), _jsx("div", { className: "memori--skeleton-line memori--skeleton-line--type" })] })] }, `skeleton-${i}`)))] })] })), _jsx(ContentPreviewModal, { open: !!selectedFile, onClose: () => setSelectedFile(null), title: selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name, isImage: !!selectedFile &&
                    isImageContent(selectedFile.content, selectedFile.type), imageSrc: selectedFile &&
                    isImageContent(selectedFile.content, selectedFile.type)
                    ? selectedFile.content
                    : undefined, imageAlt: (_a = selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name) !== null && _a !== void 0 ? _a : '', children: selectedFile &&
                    !isImageContent(selectedFile.content, selectedFile.type) &&
                    (isHtmlFile(selectedFile) ? (_jsx(Snippet, { preview: false, medium: {
                            mediumID: selectedFile.id,
                            mimeType: 'application/xml',
                            content: getDisplayContent(selectedFile),
                            title: selectedFile.name,
                        } })) : (getDisplayContent(selectedFile))) })] }));
};
export default FilePreview;
//# sourceMappingURL=FilePreview.js.map