import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, RadioGroup } from '@headlessui/react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
const SendOnEnterMenu = ({ sendOnEnter, setSendOnEnter }) => {
    const { t } = useTranslation();
    return (_jsxs(Menu, { as: "div", className: "memori-send-on-enter-menu", children: [_jsx(Menu.Button, { className: cx('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', 'memori--conversation-button'), children: _jsx("div", { className: "memori-button--icon", children: _jsx("span", { style: {
                            display: 'block',
                            width: '1rem',
                            height: '1rem',
                        }, children: "\u2026" }) }) }), _jsx(Menu.Items, { className: "memori-menu--overlay", children: _jsxs(RadioGroup, { value: sendOnEnter, onChange: setSendOnEnter, children: [_jsx(RadioGroup.Option, { value: "keypress", className: "memori-menu--option", children: ({ checked }) => (_jsx(Menu.Item, { children: _jsx(Button, { className: "memori-menu--button", ghost: true, outlined: checked, icon: _jsx("span", { className: "memori-menu--icon", children: checked ? '✓' : '' }), children: t('widget.sendOnKeypress') }) })) }), _jsx(RadioGroup.Option, { value: "click", className: "memori-menu--option", children: ({ checked }) => (_jsx(Menu.Item, { children: _jsx(Button, { className: "memori-menu--button", ghost: true, outlined: checked, icon: _jsx("span", { className: "memori-menu--icon", children: checked ? '✓' : '' }), children: t('widget.sendOnClick') }) })) })] }) })] }));
};
export default SendOnEnterMenu;
//# sourceMappingURL=SendOnEnterMenu.js.map