import React, { FC } from 'react';
import cx from 'classnames';
import Loading from '../icons/Loading';
import './Button.css';

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
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void;
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
  onTouchEnd,
  children,
}) => (
  <button
    id={id}
    type={htmlType}
    onClick={onClick}
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
