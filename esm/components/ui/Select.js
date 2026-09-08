import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import cx from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import SelectIcon from '../icons/SelectIcon';
const Select = ({ className, value, name, displayValue, options, onChange, disabled = false, label, placeholder, }) => {
    return (_jsx("div", { className: cx('memori-select', className), children: _jsxs(Listbox, { value: value, onChange: value => {
                onChange(value);
            }, disabled: disabled, name: name, children: [label && (_jsxs(Listbox.Label, { className: "memori-select--label", children: [label, ":"] })), _jsxs(Listbox.Button, { "aria-label": label, className: "memori-select--button", children: [_jsx("span", { className: cx('memori-select--value', {
                                'memori-select--value-placeholder': !value,
                            }), children: value ? displayValue || value : placeholder }), _jsx("span", { className: "memori-select--icon", children: _jsx(SelectIcon, {}) })] }), _jsx(Transition, { as: Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx(Listbox.Options, { className: "memori-select--options", children: options.map(opt => (_jsx(Listbox.Option, { value: opt.value, className: "memori-select--option", children: opt.label }, opt.value))) }) })] }) }));
};
export default Select;
//# sourceMappingURL=Select.js.map