import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import cx from 'classnames';
const Checkbox = ({ label, className, disabled = false, indeterminate = false, checked, children, onChange, name, ...props }) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (!inputRef.current)
            return;
        inputRef.current.indeterminate = indeterminate;
    }, [inputRef, indeterminate]);
    return (_jsxs("label", { className: cx('memori-checkbox', className, {
            'memori-checkbox--disabled': disabled,
            'memori-checkbox--indeterminate': indeterminate,
        }), children: [_jsxs("span", { className: "memori-checkbox--input-wrapper", children: [_jsx("input", { ref: inputRef, type: "checkbox", ...props, name: name, disabled: disabled, checked: checked || indeterminate, className: "memori-checkbox--input", onChange: onChange }), _jsx("span", { className: "memori-checkbox--inner" })] }), !!(label === null || label === void 0 ? void 0 : label.length) && (_jsx("span", { className: "memori-checkbox--text", children: label }))] }));
};
export default Checkbox;
//# sourceMappingURL=Checkbox.js.map