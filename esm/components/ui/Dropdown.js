import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import cx from 'classnames';
const Dropdown = ({ open = false, onClose, children, className, trigger, placement = 'bottom-right', }) => {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(open);
    useEffect(() => {
        setIsOpen(open);
    }, [open]);
    useEffect(() => {
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
    return (_jsxs("div", { className: cx('memori-dropdown', className), ref: dropdownRef, children: [_jsx("div", { className: "memori-dropdown--trigger", onClick: handleTriggerClick, children: trigger }), isOpen && (_jsx("div", { className: cx('memori-dropdown--content', `memori-dropdown--content--${placement}`), children: children }))] }));
};
export default Dropdown;
//# sourceMappingURL=Dropdown.js.map