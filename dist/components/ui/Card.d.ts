import React, { FC } from 'react';
export interface Props {
    children?: React.ReactChild;
    loading?: boolean;
    className?: string;
    title?: string;
    description?: string;
    cover?: JSX.Element | React.ReactNode | string;
    hoverable?: boolean;
    onClick?: () => void;
}
declare const Card: FC<Props>;
export default Card;
