"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@headlessui/react");
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const ChangeMode = ({ instruct, canInstruct, onChangeMode, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return canInstruct ? ((0, jsx_runtime_1.jsx)("div", { className: "memori--changeMode-instruct", children: (0, jsx_runtime_1.jsxs)(react_1.RadioGroup, { name: "instruct", value: instruct ? 'instruct' : 'test', defaultValue: instruct ? 'instruct' : 'test', className: "memori--changeMode-instruct-radio", onChange: onChangeMode, children: [(0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "instruct", className: "memori--changeMode-instruct-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, children: t('widget.instruct') || 'Instruct' })) }), (0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "test", className: "memori--changeMode-instruct-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, children: t('widget.test') || 'Test' })) })] }) })) : null;
};
exports.default = ChangeMode;
//# sourceMappingURL=ChangeMode.js.map