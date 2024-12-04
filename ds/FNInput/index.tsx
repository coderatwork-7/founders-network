import React, {InputHTMLAttributes} from 'react';

import styles from './FNInput.module.scss';
import clsx from 'clsx';
import {Controller, RegisterOptions, useFormContext} from 'react-hook-form';

import {get} from 'lodash';
import InputErrorMessage from '../InputErrorMessage';
import {ErrorMessage} from '@hookform/error-message';
import dayjs from 'dayjs';
import FnText from '../FnText';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

export interface IFNInputProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: string;
  name: string;
  topLeftRounded?: boolean;
  topRightRounded?: boolean;
  bottomLeftRounded?: boolean;
  bottomRightRounded?: boolean;
  placeholder?: string;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  isEmail?: boolean;
  required?: boolean;
  isPhone?: boolean;
  registerOptions?: RegisterOptions;
  message?: string;
  label?: string;
}

export const FNInput: React.FC<IFNInputProps> = props => {
  const {
    description,
    label,
    type = 'text',
    topLeftRounded,
    topRightRounded,
    bottomLeftRounded,
    bottomRightRounded,
    placeholder,
    borderLeft = true,
    borderRight = true,
    borderTop = true,
    borderBottom = true,
    name,
    isEmail,
    isPhone = false,
    required = false,
    inputMode,
    registerOptions,
    value,
    onChange
  } = props;

  const {
    register,
    control,
    formState: {errors}
  } = useFormContext();

  const errorMessage = get(errors, name)?.message?.toString();

  const inputClass = clsx(styles.input, {
    [styles.topLeft]: topLeftRounded,
    [styles.topRight]: topRightRounded,
    [styles.bottomLeft]: bottomLeftRounded,
    [styles.bottomRight]: bottomRightRounded,
    [styles.borderNoneLeft]: !borderLeft,
    [styles.borderNoneRight]: !borderRight,
    [styles.borderNoneTop]: !borderTop,
    [styles.borderNoneBottom]: !borderBottom,
    [styles.error]: !!errorMessage
  });

  const Input = () => {
    if (isEmail) {
      return (
        <input
          inputMode={inputMode}
          placeholder={placeholder}
          type={type}
          className={inputClass}
          {...register(name, {
            required: {value: required, message: 'This field is required'},
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email address.'
            }
          })}
        />
      );
    }

    if (isPhone) {
      <input
        inputMode={inputMode}
        placeholder={placeholder}
        type={type}
        className={inputClass}
        autoComplete="tel"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Phone number"
        {...register(name, {
          required: {value: required, message: 'This field is required'},
          pattern: {
            value:
              /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
            message: 'Please enter a valid phone number.'
          }
        })}
      />;
    }
    switch (type) {
      case 'radio':
        return (
          <input
            inputMode={inputMode}
            type="radio"
            placeholder={placeholder}
            className={inputClass}
            {...register(name, {
              required: {value: required, message: 'This field is required'}
            })}
            value={value}
          />
        );
      case 'textarea':
        return (
          <textarea
            inputMode={inputMode}
            placeholder={placeholder}
            className={inputClass}
            {...register(name, {
              required: {value: required, message: 'This field is required'}
            })}
          />
        );
      case 'url':
        return (
          <input
            inputMode={inputMode}
            placeholder={placeholder}
            className={inputClass}
            {...register(name, {
              required: {value: required, message: 'This field is required'}
            })}
          />
        );
      case 'date':
        return (
          <input
            inputMode={inputMode}
            id={name}
            {...register(name, {
              required: {value: required, message: 'This field is required'},
              ...registerOptions
            })}
            placeholder={placeholder}
            type={type}
            className={inputClass}
            value={value}
            onChange={onChange}
          />
        );
      case 'number':
        return (
          <input
            inputMode={inputMode}
            id={name}
            {...register(name, {
              required: {value: required, message: 'This field is required'},
              ...registerOptions
            })}
            placeholder={placeholder}
            type={type}
            className={inputClass}
            value={value}
            onChange={onChange}
          />
        );
      case 'currency':
        return (
          <input
            inputMode={inputMode}
            id={name}
            {...register(name, {
              required: {value: required, message: 'This field is required'},
              ...registerOptions
            })}
            placeholder={placeholder}
            type="number"
            className={inputClass}
            value={value}
            onChange={onChange}
          />
        );
      case 'percentage':
        return (
          <input
            inputMode={inputMode}
            id={name}
            {...register(name, {
              required: {value: required, message: 'This field is required'},
              ...registerOptions
            })}
            placeholder={placeholder}
            type="number"
            className={inputClass}
            value={value}
            onChange={onChange}
          />
        );
      default:
        return (
          <input
            inputMode={inputMode}
            id={name}
            {...register(name, {
              required: {value: required, message: 'This field is required'},
              ...registerOptions
            })}
            placeholder={placeholder}
            type={type}
            className={inputClass}
          />
        );
    }
  };

  return (
    <div className={styles.FNInput}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <FnText className={styles.description}>{description}</FnText>
      <Input />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({message}) => <InputErrorMessage message={message} />}
      />
    </div>
  );
};

export default FNInput;
