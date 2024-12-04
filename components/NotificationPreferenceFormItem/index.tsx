import React, {useEffect, useState} from 'react';

import styles from './NotificationPreferenceFormItem.module.scss';
import {TMutation} from '@/utils/types/TMutation';
import {FormProvider, useForm} from 'react-hook-form';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import FnRadioGroup from '@/ds/FnRadioGroup';
import FnText from '@/ds/FnText';
import {Button} from '@/ds/Button';

interface IProps {
  description?: string;
  name: string;
  title: string;
  value?: string | number | boolean;
  endpoint: TMutation;
  editable?: boolean;
  radioValues: {label: string; value: string | number}[];
}

export const NotificationPreferenceFormItem: React.FC<IProps> = props => {
  const {
    description,
    endpoint,
    editable = true,
    name,
    radioValues,
    title,
    value
  } = props;

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

  useEffect(() => {
    methods.reset(defaultValues);
  }, [value]);

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  const mutation = useGetMutationFunction(endpoint);

  const firstKey = name.split('.')[1];

  const onSubmit = async (data: any) => {
    const emailType = Object.keys(data)[1];

    const formatData = () => {
      if (emailType === 'realTimeEmails') {
        return {
          [emailType]: {[firstKey]: {[data?.[emailType][firstKey]]: true}}
        };
      }
      if (emailType === 'periodicEmails') {
        return {
          periodicEmails: {
            [firstKey]: data?.[emailType][firstKey] === 'true' ? true : false
          }
        };
      }
    };

    const formattedData = formatData();

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

  const activeValue = value
    ? Object.entries(value).find(([key, value]) => value === true)?.[0]
    : undefined;

  const displayValue =
    value === true
      ? 'Send it!'
      : value === false
      ? `Don't send it.`
      : radioValues.find(item => item.value === activeValue)?.label;

  if (edit && editable) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              <FnRadioGroup
                label={title}
                description={description}
                name={name}
                options={radioValues}
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
    <div className={styles.NotificationPreferenceFormItem}>
      <div>
        <FnText bold type="heading-xxSmall">
          {title}
        </FnText>
        <FnText>{!!displayValue ? displayValue : 'Not listed'}</FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default NotificationPreferenceFormItem;
