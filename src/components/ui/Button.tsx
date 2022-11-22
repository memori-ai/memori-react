import React, { FC } from 'react';
import cx from 'classnames';
import Loading from '../icons/Loading';
import './Button.css';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactChild;
  primary?: boolean;
  outlined?: boolean;
  padded?: boolean;
  icon?: React.ReactNode;
  shape?: 'square' | 'rounded' | 'circle';
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Button: FC<Props> = ({
  primary = false,
  outlined = false,
  padded = true,
  shape = 'rounded',
  danger = false,
  loading = false,
  disabled = false,
  icon,
  children,
  ...props
}) => (
  <button
    {...props}
    disabled={loading || disabled}
    className={cx(props.className, 'memori-button', {
      'memori-button--primary': primary,
      'memori-button--outlined': outlined,
      'memori-button--square': shape === 'square',
      'memori-button--rounded': shape === 'rounded',
      'memori-button--circle': shape === 'circle',
      'memori-button--padded': padded,
      'memori-button--with-icon': (icon || loading) && children,
      'memori-button--icon-only': (icon || loading) && !children,
      'memori-button--danger': danger,
      'memori-button--loading': loading,
    })}
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
