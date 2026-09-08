import React, { FC } from 'react';
export interface Props {
    title?: string | React.ReactNode;
    open?: boolean;
    data?: any;
    onClose?: () => void;
    width?: number | string;
    children?: React.ReactNode;
    footer?: {
        leftAction?: React.ReactNode;
        leftActionClassName?: string;
        onSubmit?: () => void;
        loading?: boolean;
    };
    extra?: React.ReactNode;
    className?: string;
    placement?: 'left' | 'right';
    description?: string | JSX.Element | React.ReactNode;
    loading?: boolean;
    animated?: boolean;
    closable?: boolean;
    widthMd?: string;
    widthLg?: string;
    confirmDialogTitle?: string;
    confirmDialogMessage?: string;
    showBackdrop?: boolean;
    preventBackdropClose?: boolean;
    enterDuration?: string;
    leaveDuration?: string;
    titleWithClosable?: {
        title: string;
        actions?: Array<{
            icon?: React.ReactNode;
            onClick?: () => void;
            title?: string;
            visible?: boolean;
            disabled?: boolean;
            loading?: boolean;
            className?: string;
            [key: string]: any;
        }>;
        showClosable?: boolean;
    };
}
declare const Drawer: FC<Props>;
export default Drawer;
