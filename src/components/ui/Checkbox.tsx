import React, { FC } from 'react';
import cx from 'classnames';

export interface Props extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<Props> = ({
  label,
  className,
  disabled = false,
  checked,
  children,
  onChange,
  name,
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
        name={name}
        disabled={disabled}
        defaultChecked={checked}
        className="memori-checkbox--input"
        onChange={onChange}
      />
      <span className="memori-checkbox--inner" />
    </span>
    <span className="memori-checkbox--text">{label}</span>
  </label>
);

export default Checkbox;
