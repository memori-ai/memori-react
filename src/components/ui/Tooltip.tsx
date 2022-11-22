import React, { FC } from 'react';
import cx from 'classnames';
import './Tooltip.css';

export interface Props {
  content: string | JSX.Element | React.ReactNode;
  className?: string;
  alignLeft?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Tooltip: FC<Props> = ({
  content,
  className,
  alignLeft = false,
  disabled = false,
  children,
}) => (
  <div
    className={cx('memori-tooltip', className, {
      'memori-tooltip--align-left': alignLeft,
      'memori-tooltip--disabled': disabled,
    })}
  >
    <div className="memori-tooltip--content">{content}</div>
    <div className="memori-tooltip--trigger">{children}</div>
  </div>
);

export default Tooltip;
