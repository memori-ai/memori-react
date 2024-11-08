import React, { FC } from 'react';
import cx from 'classnames';
import Loading from '../icons/Loading';

export interface Props {
  children?:
    | React.ReactChild
    | React.ReactChild[]
    | React.ReactNode
    | JSX.Element;
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
  onMouseDown?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseLeave?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onTouchStart?: (
    event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent
  ) => void;
  onTouchEnd?: (
    event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent
  ) => void;
}

const Button: FC<Props> = ({
  primary = false,
  outlined = false,
  ghost = false,
  padded = true,
  shape = 'rounded',
  danger = false,
  loading = false,
  disabled = false,
  block = false,
  icon,
  className,
  title,
  id,
  htmlType,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  children,
  isActive,
}) => (
  <button
    id={id}
    type={htmlType}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    title={title}
    disabled={loading || disabled}
    className={cx(
      'memori-button',
      {
        'memori-button--primary': primary,
        'memori-button--outlined': outlined,
        'memori-button--ghost': ghost,
        'memori-button--square': shape === 'square',
        'memori-button--rounded': shape === 'rounded',
        'memori-button--circle': shape === 'circle',
        'memori-button--padded': padded,
        'memori-button--block': block,
        'memori-button--with-icon': (icon || loading) && children,
        'memori-button--icon-only': (icon || loading) && !children,
        'memori-button--danger': danger,
        'memori-button--loading': loading,
        'memori-button--active': isActive,
      },
      className
    )}
  >
    {icon && !loading && <span className="memori-button--icon">{icon}</span>}
    {loading && (
      <span className="memori-button--icon loading-icon">
        <Loading loading />
      </span>
    )}
    {children}
  </button>
);

export default Button;
