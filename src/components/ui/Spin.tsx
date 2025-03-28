import React, { FC } from 'react';
import cx from 'classnames';
import Loading from '../icons/Loading';
import Tooltip from './Tooltip';

export interface Props {
  spinning?: boolean;
  className?: string;
  primary?: boolean;
  tip?: string;
  size?: 'small' | 'middle' | 'large';
  children?: JSX.Element | React.ReactNode;
}

const Spin: FC<Props> = ({
  spinning = false,
  primary = false,
  className,
  children,
  tip,
  size = 'middle',
}: Props) => (
  <div
    className={cx('memori-spin', className, {
      'memori-spin--spinning': spinning,
      'memori-spin--primary': primary,
      [`memori-spin--${size}`]: size,
    })}
  >
    {tip && <Tooltip content={tip} align="topLeft">
      {children}
    </Tooltip>}
    <div className="memori-spin--spinner">
      <Loading loading />
    </div>
  </div>
);

export default Spin;
