import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import Copy from '../../../../icons/Copy';
import Download from '../../../../icons/Download';
import PrintIcon from '../../../../icons/Print';
import Link from '../../../../icons/Link';
const CopyMenuItem = ({ format, onClick, loading = false, disabled = false, active = false, }) => {
    const handleClick = () => {
        if (!disabled && !loading) {
            onClick(format);
        }
    };
    const getIcon = () => {
        if (loading) {
            return (_jsx("div", { className: "memori-copy-menu-item-loading", children: _jsx("div", { className: "memori-copy-menu-item-spinner" }) }));
        }
        switch (format.action) {
            case 'pdf':
                return _jsx(Download, { className: "memori-copy-menu-item-icon" });
            case 'print':
                return _jsx(PrintIcon, { className: "memori-copy-menu-item-icon" });
            case 'link':
                return _jsx(Link, { className: "memori-copy-menu-item-icon" });
            default:
                return _jsx(Copy, { className: "memori-copy-menu-item-icon" });
        }
    };
    return (_jsx("button", { type: "button", className: cx('memori-copy-menu-item', {
            'memori-copy-menu-item--loading': loading,
            'memori-copy-menu-item--disabled': disabled,
            'memori-copy-menu-item--pdf': format.action === 'pdf',
            'memori-copy-menu-item--print': format.action === 'print',
            'memori-copy-menu-item--active': active,
            'memori-copy-menu-item--external': format.action === 'link',
            'memori-copy-menu-item--copy': format.action === 'copy',
            'memori-copy-menu-item--download': format.action === 'download',
        }), onClick: handleClick, disabled: disabled || loading, title: format.description, children: _jsxs("div", { className: "memori-copy-menu-item-content", children: [_jsx("div", { className: "memori-copy-menu-item-icon-wrapper", children: getIcon() }), _jsxs("div", { className: "memori-copy-menu-item-text", children: [_jsx("div", { className: "memori-copy-menu-item-label", children: format.label }), format.description && (_jsx("div", { className: "memori-copy-menu-item-description", children: format.description }))] }), format.isAsync && (_jsx("div", { className: "memori-copy-menu-item-async-indicator", children: _jsx("span", { className: "memori-copy-menu-item-async-badge", children: "PDF" }) }))] }) }));
};
export default CopyMenuItem;
//# sourceMappingURL=CopyMenuItem.js.map