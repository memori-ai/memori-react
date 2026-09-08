"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Checkbox = ({ label, className, disabled = false, indeterminate = false, checked, children, onChange, name, ...props }) => {
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!inputRef.current)
            return;
        inputRef.current.indeterminate = indeterminate;
    }, [inputRef, indeterminate]);
    return ((0, jsx_runtime_1.jsxs)("label", { className: (0, classnames_1.default)('memori-checkbox', className, {
            'memori-checkbox--disabled': disabled,
            'memori-checkbox--indeterminate': indeterminate,
        }), children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-checkbox--input-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "checkbox", ...props, name: name, disabled: disabled, checked: checked || indeterminate, className: "memori-checkbox--input", onChange: onChange }), (0, jsx_runtime_1.jsx)("span", { className: "memori-checkbox--inner" })] }), !!(label === null || label === void 0 ? void 0 : label.length) && ((0, jsx_runtime_1.jsx)("span", { className: "memori-checkbox--text", children: label }))] }));
};
exports.default = Checkbox;
//# sourceMappingURL=Checkbox.js.map