import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import Code from '../../../../icons/Code';
import { PreviewIcon } from '../../../../icons/Preview';
const TabSwitch = ({ activeTab, onTabChange, hasPreview, }) => {
    const tabs = [
        {
            id: 'code',
            icon: Code,
        },
        ...(hasPreview
            ? [
                {
                    id: 'preview',
                    icon: PreviewIcon,
                },
            ]
            : []),
    ];
    return (_jsx("div", { className: "memori-tab-switch", children: _jsx("div", { className: "memori-tab-switch__container", children: _jsxs("div", { className: "memori-tab-switch__track", style: {
                    '--tab-count': tabs.length,
                }, children: [_jsx("div", { className: "memori-tab-switch__indicator", style: {
                            '--active-index': tabs.findIndex(tab => tab.id === activeTab),
                        } }), tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (_jsx("button", { type: "button", className: cx('memori-tab-switch__button', {
                                'memori-tab-switch__button--active': activeTab === tab.id,
                            }), onClick: () => onTabChange(tab.id), "aria-pressed": activeTab === tab.id, children: _jsx(IconComponent, { className: "memori-tab-switch__icon" }) }, tab.id));
                    })] }) }) }));
};
export default TabSwitch;
//# sourceMappingURL=TabSwitch.js.map