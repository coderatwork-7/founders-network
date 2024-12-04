import React, {InputHTMLAttributes} from 'react';

import styles from './FNRadioInput.module.scss';

import {useFormContext} from 'react-hook-form';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string | number;
}

export const FNRadioInput: React.FC<IProps> = props => {
  const {label, name, value, required} = props;
  const {
    register,
    formState: {errors}
  } = useFormContext();

  return (
    <div className={styles.FnRadioInput}>
      <input
        type="radio"
        value={value}
        {...register(name, {
          required: {value: !!required, message: 'This field is required'}
        })}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default FNRadioInput;
