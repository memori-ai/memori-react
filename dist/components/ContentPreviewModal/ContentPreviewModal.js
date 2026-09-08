"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Modal_1 = tslib_1.__importDefault(require("../ui/Modal"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const ContentPreviewModal = ({ open, onClose, title, isImage = false, imageSrc, imageAlt = '', children, className, }) => {
    const width = 'min(90vw, 800px)';
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, { open: open, onClose: () => onClose(), width: width, widthMd: width, className: (0, classnames_1.default)('memori-content-preview-modal', className, {
            'memori-content-preview-modal--image': isImage,
        }), closable: true, title: title, footer: null, children: (0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-content-preview-modal--body', {
                'memori-content-preview-modal--body--image': isImage,
                'memori-content-preview-modal--body--content': !isImage,
            }), children: isImage && imageSrc ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-content-preview-modal--image-wrap", children: (0, jsx_runtime_1.jsx)("img", { src: imageSrc, alt: imageAlt, className: "memori-content-preview-modal--image" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "memori-content-preview-modal--snippet-wrap", children: children })) }) }));
};
exports.default = ContentPreviewModal;
//# sourceMappingURL=ContentPreviewModal.js.map