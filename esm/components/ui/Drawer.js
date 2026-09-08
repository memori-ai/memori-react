import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState, useCallback, } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from './ConfirmDialog';
const Drawer = ({ title, open = false, data, onClose = () => { }, children, width = '80%', footer, showBackdrop = true, extra, className, placement = 'right', description, loading = false, animated = true, closable = true, widthMd = '80%', widthLg = '60%', confirmDialogTitle, confirmDialogMessage, preventBackdropClose = false, enterDuration = 'duration-300', leaveDuration = 'duration-200', titleWithClosable, }) => {
    var _a;
    const [originalData, setOriginalData] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (open && data && !originalData) {
            setOriginalData(data);
        }
        if (!open) {
            setOriginalData(null);
        }
    }, [open, data, originalData]);
    const checkChanges = useCallback(() => {
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
    const handleClose = useCallback(() => {
        checkChanges();
    }, [checkChanges]);
    const handleConfirmUnsavedChanges = useCallback(() => {
        setConfirmDialogOpen(false);
        onClose();
    }, [onClose]);
    return (_jsxs(_Fragment, { children: [_jsx(ConfirmDialog, { isOpen: confirmDialogOpen, onClose: () => setConfirmDialogOpen(false), onConfirm: handleConfirmUnsavedChanges, title: confirmDialogTitle || t('confirmDialog.title'), message: confirmDialogMessage || t('confirmDialog.message'), confirmText: t('confirm') || 'Confirm', cancelText: t('cancel') || 'Cancel' }), _jsx(Transition, { appear: true, show: open, as: React.Fragment, children: _jsxs(Dialog, { open: open, onClose: preventBackdropClose ? () => { } : handleClose, className: cx('memori-drawer', className), children: [showBackdrop && (_jsx(Transition.Child, { as: React.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "memori-drawer--backdrop" }) })), _jsx("div", { className: "memori-drawer--container", children: _jsx("div", { className: "memori-drawer--container-scrollable", children: _jsx(Transition.Child, { static: true, as: React.Fragment, enter: `ease-out ${enterDuration}`, enterFrom: animated ? 'max-w-0 opacity-0' : 'opacity-0', enterTo: "max-w-100 opacity-100", leave: `ease-in ${leaveDuration}`, leaveFrom: "max-w-100 opacity-100", leaveTo: animated ? 'max-w-0 opacity-0' : 'opacity-0', children: _jsxs(Dialog.Panel, { className: cx('memori-drawer--panel', {
                                            'memori-drawer--panel-left': placement === 'left',
                                            'memori-drawer--with-footer': !!footer,
                                            'memori-drawer--with-title-closable': !!titleWithClosable,
                                        }), style: {
                                            '--memori-drawer--width': width,
                                            '--memori-drawer--width--lg': widthLg,
                                            '--memori-drawer--width--md': widthMd,
                                        }, children: [titleWithClosable ? (_jsxs("div", { className: "memori-drawer--title-with-closable", children: [_jsx(Dialog.Title, { className: "memori-drawer--title-with-closable-title", children: titleWithClosable.title }), _jsxs("div", { className: "memori-drawer--title-with-closable-actions", children: [(_a = titleWithClosable.actions) === null || _a === void 0 ? void 0 : _a.filter((action) => action.visible).map((action, index) => {
                                                                const { icon, onClick, title, disabled, loading, className, ...restProps } = action;
                                                                return (_jsx(Button, { shape: "circle", outlined: true, icon: icon, onClick: onClick, title: title, disabled: disabled, loading: loading, className: className, ...restProps }, index));
                                                            }), titleWithClosable.showClosable && (_jsx(Button, { shape: "circle", outlined: true, icon: _jsx(Close, {}), onClick: handleClose, className: "memori-drawer--title-with-closable-actions-close" }))] })] })) : (_jsx(_Fragment, { children: closable && (_jsx("div", { className: "memori-drawer--close", children: _jsx(Button, { shape: "circle", outlined: true, icon: _jsx(Close, {}), onClick: handleClose }) })) })), _jsx(Spin, { spinning: loading, children: _jsxs("div", { className: "memori-drawer--content", children: [!titleWithClosable && title && (_jsx(Dialog.Title, { className: "memori-drawer--title", children: title })), description && (_jsx(Dialog.Description, { className: "memori-drawer--description", children: description })), _jsx("div", { className: "memori-drawer--content--scrollable", children: children })] }) }), footer && (_jsxs("div", { className: "memori-drawer--footer", children: [footer.leftAction && (_jsx("div", { className: 'memori-drawer--footer-left-action ' +
                                                            (footer.leftActionClassName || ''), children: footer.leftAction })), footer.onSubmit && (_jsxs("div", { className: "memori-drawer--footer-actions", children: [_jsx(Button, { outlined: true, onClick: handleClose, children: t('cancel') }), _jsx(Button, { htmlType: "submit", onClick: footer.onSubmit, loading: footer.loading, className: "memori-drawer--footer-confirm", children: t('confirm') })] })), extra && (_jsx("div", { className: "memori-drawer--extra", children: extra }))] }))] }) }) }) })] }) })] }));
};
Drawer.displayName = 'Drawer';
export default Drawer;
//# sourceMappingURL=Drawer.js.map