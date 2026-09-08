import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
const ChangeMode = ({ instruct, canInstruct, onChangeMode, }) => {
    const { t } = useTranslation();
    return canInstruct ? (_jsx("div", { className: "memori--changeMode-instruct", children: _jsxs(RadioGroup, { name: "instruct", value: instruct ? 'instruct' : 'test', defaultValue: instruct ? 'instruct' : 'test', className: "memori--changeMode-instruct-radio", onChange: onChangeMode, children: [_jsx(RadioGroup.Option, { value: "instruct", className: "memori--changeMode-instruct-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, children: t('widget.instruct') || 'Instruct' })) }), _jsx(RadioGroup.Option, { value: "test", className: "memori--changeMode-instruct-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, children: t('widget.test') || 'Test' })) })] }) })) : null;
};
export default ChangeMode;
//# sourceMappingURL=ChangeMode.js.map