import React, { FC } from 'react';
import cx from 'classnames';
import './Checkbox.css';

export interface Props extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

const Checkbox: FC<Props> = ({
  label,
  className,
  disabled = false,
  checked,
  children,
  ...props
}) => (
  <label
    className={cx('memori-checkbox', className, {
      'memori-checkbox--disabled': disabled,
    })}
  >
    <span className="memori-checkbox--input-wrapper">
      <input
        type="checkbox"
        {...props}
        disabled={disabled}
        defaultChecked={checked}
        className="memori-checkbox--input"
      />
      <span className="memori-checkbox--inner" />
    </span>
    <span className="memori-checkbox--text">{label}</span>
  </label>
);

export default Checkbox;
