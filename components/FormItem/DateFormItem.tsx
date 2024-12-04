import React, {useState} from 'react';

import styles from './FormItem.module.scss';
import FnText from '@/ds/FnText';
import FNInput from '@/ds/FNInput';
import {FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/ds/Button';
import dayjs from 'dayjs';

import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';

var customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

export interface ISelectOptions {
  label: string;
  value?: string | number;
}

interface IProps {
  description?: string;
  name: string;
  placeholder?: string;
  title: string;
  value?: string;
  endpoint: TMutation;
  required?: boolean;
}

export const DateFormItem: React.FC<IProps> = props => {
  const {description, endpoint, name, placeholder, required, title, value} =
    props;
  const [edit, setEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createDefaultValues = (key: string, value: any) => {
    return {
      [key]: value
    };
  };

  const defaultValues = createDefaultValues(name, value);

  const methods = useForm({
    defaultValues
  });

  const mutation = useGetMutationFunction(endpoint);

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  const onSubmit = async (data: any) => {
    const formatData = () => {
      return {[name]: dayjs(data[name]).format('MM/DD/YYYY')};
    };

    const formattedData = formatData();

    try {
      mutation.mutate(formattedData, {
        onSuccess: () => setEdit(false),
        onSettled: () => setSubmitting(false)
      });

      if (mutation.isSuccess) {
        setEdit(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const displayValue = dayjs(value).format('MM/DD/YYYY');

  if (edit) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              <FNInput
                topLeftRounded
                topRightRounded
                bottomLeftRounded
                bottomRightRounded
                description={description}
                label={title}
                name={name}
                placeholder={placeholder}
                type="date"
                required={required}
              />

              <button onClick={handleClick} className={styles.editButton}>
                Cancel
              </button>
            </div>
            <Button
              loading={submitting}
              type="submit"
              className={styles.submitButton}
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
        <FnText type="heading-xxSmall" bold>
          {title}
        </FnText>
        <FnText>{displayValue}</FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default DateFormItem;
