import React, { FC } from 'react';
export type AlertType = 'success' | 'warning' | 'error' | 'info';
export interface Props {
    open?: boolean;
    onClose: (value: boolean) => void;
    className?: string;
    title?: string | JSX.Element | React.ReactNode;
    description?: string | JSX.Element | React.ReactNode;
    children?: JSX.Element | React.ReactNode;
    type?: AlertType;
    icon?: JSX.Element | React.ReactNode;
    closable?: boolean;
    duration?: number | null;
    action?: JSX.Element | React.ReactNode;
    width?: string;
}
declare const Alert: FC<Props>;
export default Alert;
