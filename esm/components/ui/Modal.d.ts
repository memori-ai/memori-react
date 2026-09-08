import React, { FC } from 'react';
export interface Props {
    open?: boolean;
    onClose: (value: boolean) => void;
    className?: string;
    title?: string | JSX.Element | React.ReactNode;
    description?: string | JSX.Element | React.ReactNode;
    children?: JSX.Element | React.ReactNode;
    footer?: JSX.Element | React.ReactNode;
    loading?: boolean;
    closable?: boolean;
    width?: string;
    widthMd?: string;
}
declare const Modal: FC<Props>;
export default Modal;
