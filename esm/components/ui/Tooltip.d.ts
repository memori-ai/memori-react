import React, { FC } from 'react';
export interface Props {
    content: string | JSX.Element | React.ReactNode;
    className?: string;
    align?: 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    disabled?: boolean;
    children: React.ReactNode;
    visible?: boolean;
}
declare const Tooltip: FC<Props>;
export default Tooltip;
