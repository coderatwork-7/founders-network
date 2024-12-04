import {useState} from 'react';

import styles from './CardExpiryDateInput.module.scss';

import {Control, Controller, FieldValues} from 'react-hook-form';

interface IProps {
  control?: Control<any, any>;
  required?: boolean;
}

export const CardExpiryDateInput: React.FC<IProps> = ({control, required}) => {
  const [text, setText] = useState('');

  const formatDate = (inputValue: string) => {
    const charArray = [];
    const limit = Math.min(5, inputValue.length);
    for (let i = 0; i < limit; i++) {
      const char = inputValue[i];
      if (/\d/.exec(char)) {
        charArray.push(char);
      }
      if (
        i + 1 < inputValue.length &&
        inputValue[i + 1] != '/' &&
        charArray.length == 2
      ) {
        charArray.push('/');
      }
    }
    setText(charArray.join(''));
  };

  return (
    <Controller
      name="plan.expiration"
      control={control}
      rules={{required}}
      render={({field: {onChange, value}}) => {
        formatDate(value ?? '');
        return (
          <input
            type="text"
            inputMode="numeric"
            className={styles.input}
            value={text}
            onChange={onChange}
            placeholder="MM/YY"
          />
        );
      }}
    />
  );
};
