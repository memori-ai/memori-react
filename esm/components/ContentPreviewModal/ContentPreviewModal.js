import { jsx as _jsx } from "react/jsx-runtime";
import Modal from '../ui/Modal';
import cx from 'classnames';
const ContentPreviewModal = ({ open, onClose, title, isImage = false, imageSrc, imageAlt = '', children, className, }) => {
    const width = 'min(90vw, 800px)';
    return (_jsx(Modal, { open: open, onClose: () => onClose(), width: width, widthMd: width, className: cx('memori-content-preview-modal', className, {
            'memori-content-preview-modal--image': isImage,
        }), closable: true, title: title, footer: null, children: _jsx("div", { className: cx('memori-content-preview-modal--body', {
                'memori-content-preview-modal--body--image': isImage,
                'memori-content-preview-modal--body--content': !isImage,
            }), children: isImage && imageSrc ? (_jsx("div", { className: "memori-content-preview-modal--image-wrap", children: _jsx("img", { src: imageSrc, alt: imageAlt, className: "memori-content-preview-modal--image" }) })) : (_jsx("div", { className: "memori-content-preview-modal--snippet-wrap", children: children })) }) }));
};
export default ContentPreviewModal;
//# sourceMappingURL=ContentPreviewModal.js.map