import React, {ComponentType, useState} from 'react';

import styles from './FormItem.module.scss';
import currnecyFormItemStyles from './CurrencyFormItem.module.scss';
import {FormProvider, useForm} from 'react-hook-form';
import {TMutation} from '@/utils/types/TMutation';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import FnText from '@/ds/FnText';
import FNInput from '@/ds/FNInput';
import {Button} from '@/ds/Button';
import {NumericFormat} from 'react-number-format';

interface IProps {
  title: string;
  placeholder?: string;
  description?: string;
  endpoint: TMutation;
  editable?: boolean;
  name: string;
  value: string | number;
}

export const CurrencyFormItem: React.FC<IProps> = props => {
  const {
    description,
    name,
    value,
    editable = true,
    endpoint,
    placeholder,
    title
  } = props;

  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(false);
  const onSubmit = async (data: any) => {
    const key = Object.keys(data)[0];

    const formatData = () => {
      if (data[key] === 'Yes') {
        return {[key]: true};
      } else if (data[key] === 'No') {
        return {[key]: false};
      } else {
        return data;
      }
    };

    const formattedData = formatData();

    const mutation = useGetMutationFunction(endpoint);

    try {
      setSubmitting(true);
      mutation.mutate(formattedData, {
        onSuccess: () => setEdit(false),
        onSettled: () => setSubmitting(false)
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const createDefaultValues = (key: string, value: any) => {
    return {
      [key]: value
    };
  };
  const defaultValues = createDefaultValues(name, value);

  const methods = useForm({
    defaultValues
  });

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  if (edit && editable) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              <div className={currnecyFormItemStyles.inputContainer}></div>
              <NumericFormat
                value={value}
                prefix="$"
                thousandSeparator
                valueIsNumericString
                // onValueChange={v => {
                //   //value without dollar signe
                //   console.log(v.value);
                // }}

                name={name}
                // placeholder={placeholder}
                // type="number"
              />

              <button onClick={handleClick} className={styles.editButton}>
                Cancel
              </button>
            </div>
            <Button
              type="submit"
              className={styles.submitButton}
              loading={submitting}
            >
              Save
            </Button>
          </div>
          <div className={styles.screen} />
        </form>
      </FormProvider>
    );
  }

  return (
    <div className={styles.FormItem}>
      <div className={styles.textContainer}>
        <FnText bold type="heading-xxSmall">
          {title}
        </FnText>
        <FnText>{value ?? 'Not listed'}</FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default CurrencyFormItem;
