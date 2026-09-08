"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Dropdown = ({ open = false, onClose, children, className, trigger, placement = 'bottom-right', }) => {
    const dropdownRef = (0, react_1.useRef)(null);
    const [isOpen, setIsOpen] = (0, react_1.useState)(open);
    (0, react_1.useEffect)(() => {
        setIsOpen(open);
    }, [open]);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    const handleTriggerClick = () => {
        setIsOpen(!isOpen);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-dropdown', className), ref: dropdownRef, children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--trigger", onClick: handleTriggerClick, children: trigger }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-dropdown--content', `memori-dropdown--content--${placement}`), children: children }))] }));
};
exports.default = Dropdown;
//# sourceMappingURL=Dropdown.js.map