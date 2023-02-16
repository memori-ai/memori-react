import React, { FC } from 'react';
import cx from 'classnames';

export interface Props {
  content: string | JSX.Element | React.ReactNode;
  className?: string;
  alignLeft?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  visible?: boolean;
}

const Tooltip: FC<Props> = ({
  content,
  className,
  alignLeft = false,
  disabled = false,
  visible = false,
  children,
}) => (
  <div
    className={cx('memori-tooltip', className, {
      'memori-tooltip--align-left': alignLeft,
      'memori-tooltip--disabled': disabled,
      'memori-tooltip--visible': visible,
    })}
  >
    <div className="memori-tooltip--content">{content}</div>
    <div className="memori-tooltip--trigger">{children}</div>
  </div>
);

export default Tooltip;
