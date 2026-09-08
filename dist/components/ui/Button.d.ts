import React, { FC } from 'react';
export interface Props {
    children?: React.ReactChild | React.ReactChild[] | React.ReactNode | JSX.Element;
    primary?: boolean;
    outlined?: boolean;
    ghost?: boolean;
    padded?: boolean;
    block?: boolean;
    icon?: React.ReactNode;
    shape?: 'square' | 'rounded' | 'circle';
    danger?: boolean;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    title?: string;
    id?: string;
    isActive?: boolean;
    htmlType?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onTouchStart?: (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent) => void;
    onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent) => void;
}
declare const Button: FC<Props>;
export default Button;
