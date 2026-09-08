import React, { FC } from 'react';
export interface Props {
    spinning?: boolean;
    className?: string;
    primary?: boolean;
    children?: JSX.Element | React.ReactNode;
}
declare const Spin: FC<Props>;
export default Spin;
