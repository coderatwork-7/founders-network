import {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import classes from '@/components/InvitationForm/invitationForm.module.scss';
import Image from 'next/image';
import {AMEX_SRC} from '@/utils/data';
import internalClasses from './cardInput.module.scss';
import clsx from 'clsx';
import valid from 'card-validator';

import styles from './cardInput.module.scss';
import {Control, Controller, useFormContext} from 'react-hook-form';
import {get} from 'lodash';

interface IProps {
  control?: Control<any, any>;
  required?: boolean;
}

export const CardInput: React.FC<IProps> = ({control, required = false}) => {
  const [text, setText] = useState('1234 1234 1234 1234');

  const inputRef = useRef<HTMLInputElement>(null);

  const cardNumber = text.replaceAll(/\s/g, '');
  const validatorObj = valid.number(cardNumber);
  const emptyText = text === '';

  const formatCCNumber = (inputValue: string) => {
    const charArray = [];
    for (let i = 0; i < inputValue?.length; i++) {
      const char = inputValue?.[i];
      if (/\d/.exec(char)) {
        charArray.push(char);
      }
      if (
        i + 1 < inputValue.length &&
        inputValue?.[i + 1] != ' ' &&
        charArray.length % 5 == 4
      ) {
        charArray.push(' ');
      }
    }
    setText(charArray.join(''));
  };

  const {
    formState: {errors}
  } = useFormContext();

  const errorMessage = get(errors, 'plan.cc')?.message?.toString();

  return (
    <div className={clsx('position-relative', internalClasses.container)}>
      <Controller
        control={control}
        name="plan.cc"
        rules={{required: 'Credit card information is required'}}
        render={({field: {onChange, onBlur, value, ref}}) => {
          formatCCNumber(value ?? '');

          return (
            <input
              inputMode="numeric"
              pattern="[0-9\s]{13,19}"
              type="text"
              className={styles.input}
              onChange={onChange}
              placeholder="1234 1234 1234 1234"
              maxLength={23}
              ref={inputRef}
              value={text}
            />
          );
        }}
      />

      <div className={clsx(styles.paymentIconsContainer)}>
        {(validatorObj.card?.type === 'mastercard' || emptyText) && (
          <Image
            alt="mastercard"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png"
            height={20}
            width={33.33}
            className={internalClasses.scale}
          />
        )}
        {(validatorObj.card?.type === 'visa' || emptyText) && (
          <Image
            alt="visa"
            src="https://www.freepnglogos.com/uploads/visa-card-logo-9.png"
            height={10}
            width={32}
            className={internalClasses.scale}
          />
        )}
        {(validatorObj.card?.type === 'american-express' || emptyText) && (
          <Image
            alt="amex"
            src={AMEX_SRC}
            height={20}
            width={26.7}
            className={internalClasses.scale}
          />
        )}
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};
