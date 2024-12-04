import {useState} from 'react';

import Image from 'next/image';

import {Control, Controller, useFormContext} from 'react-hook-form';
import styles from './CardCvvInput.module.scss';
import {get} from 'lodash';
interface IProps {
  control?: Control<any, any>;
  required?: boolean;
}

export const CardCvvInput: React.FC<IProps> = ({control, required = false}) => {
  const [text, setText] = useState('');
  const {
    formState: {errors}
  } = useFormContext();

  const errorMessage = get(errors, 'plan.ccv')?.message?.toString();

  const formatText = (inputValue: string) => {
    if (
      inputValue.length &&
      !/\d/.exec(inputValue.charAt(inputValue.length - 1))
    ) {
      setText(inputValue.slice(0, -1));
    }
    setText(inputValue);
  };

  return (
    <div className={styles.CardCvvInput}>
      <Controller
        control={control}
        name="plan.ccv"
        rules={{required}}
        render={({field: {onChange, value}}) => {
          formatText(value ?? '');
          return (
            <input
              type="text"
              inputMode="numeric"
              className={styles.input}
              value={text}
              onChange={onChange}
              placeholder="CVC"
              maxLength={4}
            />
          );
        }}
      />
      <div className={styles.cardIconContainer}>
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1o51p4x12fn9RL7nQfT4Lb6dHkHIBxAUxhOWA78S45z3QF_w34X7-vf4fD8I9Xw9RKXs&usqp=CAU"
          alt="cvv"
          height={20}
          width={38}
          className={styles.cardIcon}
        />
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};
