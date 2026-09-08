import React from 'react';
export interface DrawerFooterProps {
    children?: React.ReactNode;
    start?: React.ReactNode;
    end?: React.ReactNode;
    center?: React.ReactNode;
    closeLabel?: string;
    onClose?: () => void;
    className?: string;
}
declare const DrawerFooter: React.FC<DrawerFooterProps>;
export default DrawerFooter;
