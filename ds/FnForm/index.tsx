import React from 'react';

import styles from './FnForm.module.scss';
import {FieldValues, FormProvider, UseFormReturn} from 'react-hook-form';

interface IProps {
  methods: UseFormReturn<FieldValues, any, undefined>;
}

export const FnForm: React.FC<IProps> = props => {
  const {methods} = props;

  return (
    <FormProvider {...methods}>
      <form className={styles.FnForm}></form>
    </FormProvider>
  );
};

export default FnForm;
