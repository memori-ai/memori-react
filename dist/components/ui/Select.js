"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_2 = require("@headlessui/react");
const SelectIcon_1 = tslib_1.__importDefault(require("../icons/SelectIcon"));
const Select = ({ className, value, name, displayValue, options, onChange, disabled = false, label, placeholder, }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-select', className), children: (0, jsx_runtime_1.jsxs)(react_2.Listbox, { value: value, onChange: value => {
                onChange(value);
            }, disabled: disabled, name: name, children: [label && ((0, jsx_runtime_1.jsxs)(react_2.Listbox.Label, { className: "memori-select--label", children: [label, ":"] })), (0, jsx_runtime_1.jsxs)(react_2.Listbox.Button, { "aria-label": label, className: "memori-select--button", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, classnames_1.default)('memori-select--value', {
                                'memori-select--value-placeholder': !value,
                            }), children: value ? displayValue || value : placeholder }), (0, jsx_runtime_1.jsx)("span", { className: "memori-select--icon", children: (0, jsx_runtime_1.jsx)(SelectIcon_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)(react_2.Listbox.Options, { className: "memori-select--options", children: options.map(opt => ((0, jsx_runtime_1.jsx)(react_2.Listbox.Option, { value: opt.value, className: "memori-select--option", children: opt.label }, opt.value))) }) })] }) }));
};
exports.default = Select;
//# sourceMappingURL=Select.js.map