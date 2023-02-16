import React, { FC } from 'react';
import cx from 'classnames';
import Loading from '../icons/Loading';

export interface Props {
  spinning?: boolean;
  className?: string;
  primary?: boolean;
  children?: JSX.Element | React.ReactNode;
}

const Spin: FC<Props> = ({
  spinning = false,
  primary = false,
  className,
  children,
}: Props) => (
  <div
    className={cx('memori-spin', className, {
      'memori-spin--spinning': spinning,
      'memori-spin--primary': primary,
    })}
  >
    {children}
    <div className="memori-spin--spinner">
      <Loading loading />
    </div>
  </div>
);

export default Spin;
