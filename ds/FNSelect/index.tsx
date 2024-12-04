import React from 'react';

import styles from './FNSelect.module.scss';
import {Controller, useFormContext} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {ErrorMessage} from '@hookform/error-message';
import InputErrorMessage from '../InputErrorMessage';

interface IProps {
  name: string;
  options: any;
  defaultValue?: string;
  placeholder?: string;
  isMulti?: boolean;
  label?: string;
}

export const FNSelect: React.FC<IProps> = props => {
  const {
    defaultValue,
    isMulti,
    name,
    options,
    placeholder = 'select',
    label
  } = props;
  const animatedComponents = makeAnimated();
  const {
    control,
    formState: {errors}
  } = useFormContext();

  return (
    <div className={styles.container}>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, value}}) => {
          return (
            <Select
              className={styles.FNSelect}
              placeholder={placeholder}
              options={options}
              defaultValue={defaultValue}
              onChange={onChange}
              isMulti={isMulti}
              components={animatedComponents}
            />
          );
        }}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({message}) => <InputErrorMessage message={message} />}
      />
    </div>
  );
};

export default FNSelect;
