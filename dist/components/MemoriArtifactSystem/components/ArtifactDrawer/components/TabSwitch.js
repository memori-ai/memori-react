"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Code_1 = tslib_1.__importDefault(require("../../../../icons/Code"));
const Preview_1 = require("../../../../icons/Preview");
const TabSwitch = ({ activeTab, onTabChange, hasPreview, }) => {
    const tabs = [
        {
            id: 'code',
            icon: Code_1.default,
        },
        ...(hasPreview
            ? [
                {
                    id: 'preview',
                    icon: Preview_1.PreviewIcon,
                },
            ]
            : []),
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "memori-tab-switch", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-tab-switch__container", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-tab-switch__track", style: {
                    '--tab-count': tabs.length,
                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-tab-switch__indicator", style: {
                            '--active-index': tabs.findIndex(tab => tab.id === activeTab),
                        } }), tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return ((0, jsx_runtime_1.jsx)("button", { type: "button", className: (0, classnames_1.default)('memori-tab-switch__button', {
                                'memori-tab-switch__button--active': activeTab === tab.id,
                            }), onClick: () => onTabChange(tab.id), "aria-pressed": activeTab === tab.id, children: (0, jsx_runtime_1.jsx)(IconComponent, { className: "memori-tab-switch__icon" }) }, tab.id));
                    })] }) }) }));
};
exports.default = TabSwitch;
//# sourceMappingURL=TabSwitch.js.map