import React from 'react';
export interface Props {
    open?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    className?: string;
    trigger?: React.ReactNode;
    placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}
declare const Dropdown: React.FC<Props>;
export default Dropdown;
