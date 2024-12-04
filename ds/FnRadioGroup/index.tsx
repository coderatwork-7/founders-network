import React from 'react';

import styles from './FnRadioGroup.module.scss';
import FNRadioInput from '../FNRadioInput';
import FnText from '../FnText';
import {ErrorMessage} from '@hookform/error-message';
import {useFormContext} from 'react-hook-form';
import InputErrorMessage from '../InputErrorMessage';
import clsx from 'clsx';
import {IRadioGroup} from '@/utils/interfaces/IRadioGroup';

interface IProps {
  description?: string;
  name: string;
  options: IRadioGroup[];
  label?: string;
  required?: boolean;
}

export const FnRadioGroup: React.FC<IProps> = props => {
  const {description, label, name, required, options} = props;

  const {
    register,
    formState: {errors}
  } = useFormContext();

  const optionsClass = clsx(styles.options, {
    [styles.optionsRow]: options.length < 4
  });

  return (
    <div className={styles.RadioGroup}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <FnText className={styles.description}>{description}</FnText>

      <fieldset id={name} className={optionsClass}>
        {options.map(option => (
          <FNRadioInput
            key={option.value}
            label={option.label}
            name={name}
            value={option.value}
          />
        ))}
      </fieldset>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({message}) => <InputErrorMessage message={message} />}
      />
    </div>
  );
};

export default FnRadioGroup;
