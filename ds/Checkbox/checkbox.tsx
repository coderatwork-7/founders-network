import clsx from 'clsx';
import React from 'react';
import styles from './checkbox.module.scss';

export enum CheckboxSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg'
}

export interface CheckboxProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  size?: CheckboxSize;
  checked?: boolean;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  withLabel?: boolean;
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  className = '',
  id,
  size = CheckboxSize.Medium,
  checked = false,
  disabled = false,
  withLabel = true,
  ...props
}) => {
  const checkboxClasses = clsx(
    styles.checkbox,
    styles[`checkbox-${size}`],
    className
  );
  if (!withLabel)
    return (
      <div className={checkboxClasses}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          {...props}
          className="form-check-input"
        />
      </div>
    );
  return (
    <div className={checkboxClasses}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        {...props}
        className="form-check-input"
      />
      <label htmlFor={id} className="w-100">
        {children}
      </label>
    </div>
  );
};
