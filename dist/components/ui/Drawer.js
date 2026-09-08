"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@headlessui/react");
const Spin_1 = tslib_1.__importDefault(require("./Spin"));
const Button_1 = tslib_1.__importDefault(require("./Button"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const ConfirmDialog_1 = tslib_1.__importDefault(require("./ConfirmDialog"));
const Drawer = ({ title, open = false, data, onClose = () => { }, children, width = '80%', footer, showBackdrop = true, extra, className, placement = 'right', description, loading = false, animated = true, closable = true, widthMd = '80%', widthLg = '60%', confirmDialogTitle, confirmDialogMessage, preventBackdropClose = false, enterDuration = 'duration-300', leaveDuration = 'duration-200', titleWithClosable, }) => {
    var _a;
    const [originalData, setOriginalData] = (0, react_1.useState)(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = (0, react_1.useState)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (open && data && !originalData) {
            setOriginalData(data);
        }
        if (!open) {
            setOriginalData(null);
        }
    }, [open, data, originalData]);
    const checkChanges = (0, react_1.useCallback)(() => {
        if (!data || Object.keys(data).length === 0) {
            return onClose();
        }
        if (originalData && JSON.stringify(originalData) !== JSON.stringify(data)) {
            setConfirmDialogOpen(true);
        }
        else {
            onClose();
        }
    }, [data, originalData, onClose]);
    const handleClose = (0, react_1.useCallback)(() => {
        checkChanges();
    }, [checkChanges]);
    const handleConfirmUnsavedChanges = (0, react_1.useCallback)(() => {
        setConfirmDialogOpen(false);
        onClose();
    }, [onClose]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ConfirmDialog_1.default, { isOpen: confirmDialogOpen, onClose: () => setConfirmDialogOpen(false), onConfirm: handleConfirmUnsavedChanges, title: confirmDialogTitle || t('confirmDialog.title'), message: confirmDialogMessage || t('confirmDialog.message'), confirmText: t('confirm') || 'Confirm', cancelText: t('cancel') || 'Cancel' }), (0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: open, as: react_1.default.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { open: open, onClose: preventBackdropClose ? () => { } : handleClose, className: (0, classnames_1.default)('memori-drawer', className), children: [showBackdrop && ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--backdrop" }) })), (0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--container", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--container-scrollable", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { static: true, as: react_1.default.Fragment, enter: `ease-out ${enterDuration}`, enterFrom: animated ? 'max-w-0 opacity-0' : 'opacity-0', enterTo: "max-w-100 opacity-100", leave: `ease-in ${leaveDuration}`, leaveFrom: "max-w-100 opacity-100", leaveTo: animated ? 'max-w-0 opacity-0' : 'opacity-0', children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: (0, classnames_1.default)('memori-drawer--panel', {
                                            'memori-drawer--panel-left': placement === 'left',
                                            'memori-drawer--with-footer': !!footer,
                                            'memori-drawer--with-title-closable': !!titleWithClosable,
                                        }), style: {
                                            '--memori-drawer--width': width,
                                            '--memori-drawer--width--lg': widthLg,
                                            '--memori-drawer--width--md': widthMd,
                                        }, children: [titleWithClosable ? ((0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer--title-with-closable", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "memori-drawer--title-with-closable-title", children: titleWithClosable.title }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer--title-with-closable-actions", children: [(_a = titleWithClosable.actions) === null || _a === void 0 ? void 0 : _a.filter((action) => action.visible).map((action, index) => {
                                                                const { icon, onClick, title, disabled, loading, className, ...restProps } = action;
                                                                return ((0, jsx_runtime_1.jsx)(Button_1.default, { shape: "circle", outlined: true, icon: icon, onClick: onClick, title: title, disabled: disabled, loading: loading, className: className, ...restProps }, index));
                                                            }), titleWithClosable.showClosable && ((0, jsx_runtime_1.jsx)(Button_1.default, { shape: "circle", outlined: true, icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), onClick: handleClose, className: "memori-drawer--title-with-closable-actions-close" }))] })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: closable && ((0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--close", children: (0, jsx_runtime_1.jsx)(Button_1.default, { shape: "circle", outlined: true, icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), onClick: handleClose }) })) })), (0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: loading, children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer--content", children: [!titleWithClosable && title && ((0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "memori-drawer--title", children: title })), description && ((0, jsx_runtime_1.jsx)(react_2.Dialog.Description, { className: "memori-drawer--description", children: description })), (0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--content--scrollable", children: children })] }) }), footer && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer--footer", children: [footer.leftAction && ((0, jsx_runtime_1.jsx)("div", { className: 'memori-drawer--footer-left-action ' +
                                                            (footer.leftActionClassName || ''), children: footer.leftAction })), footer.onSubmit && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer--footer-actions", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: handleClose, children: t('cancel') }), (0, jsx_runtime_1.jsx)(Button_1.default, { htmlType: "submit", onClick: footer.onSubmit, loading: footer.loading, className: "memori-drawer--footer-confirm", children: t('confirm') })] })), extra && ((0, jsx_runtime_1.jsx)("div", { className: "memori-drawer--extra", children: extra }))] }))] }) }) }) })] }) })] }));
};
Drawer.displayName = 'Drawer';
exports.default = Drawer;
//# sourceMappingURL=Drawer.js.map