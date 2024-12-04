import React, {useEffect, useState} from 'react';

import styles from './FormItem.module.scss';
import FnText from '@/ds/FnText';
import FNInput from '@/ds/FNInput';
import {FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/ds/Button';

import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';

interface IProps {
  description?: string;
  firstName?: string;
  lastName?: string;
  title: string;

  endpoint: TMutation;
  editable?: boolean;
  type?: 'text' | 'number' | 'textarea' | 'radio';
}

export const NameFormItem: React.FC<IProps> = props => {
  const {
    description,
    editable = true,
    endpoint,
    title,
    type = 'text',
    firstName,
    lastName
  } = props;

  const [edit, setEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {firstName, lastName}
  });

  useEffect(() => {
    methods.reset({firstName, lastName});
  }, [firstName, lastName]);

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  const mutation = useGetMutationFunction(endpoint);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      mutation.mutate(data, {
        onSuccess: () => setEdit(false),
        onSettled: () => setSubmitting(false)
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const displayValue = !!firstName && !!lastName && `${firstName} ${lastName}`;

  if (edit && editable) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div>
              <FnText>{title}</FnText>
              <FnText className={styles.description}>{description}</FnText>
            </div>
            <div className={styles.row}>
              <FNInput
                topLeftRounded
                topRightRounded
                bottomLeftRounded
                bottomRightRounded
                description="First Name"
                name="firstName"
                placeholder="First Name"
                type={type}
              />
              <FNInput
                topLeftRounded
                topRightRounded
                bottomLeftRounded
                bottomRightRounded
                description="Last Name"
                name="lastName"
                placeholder="Last Name"
                type={type}
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
      <div>
        <FnText type="heading-xxSmall" bold>
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

export default NameFormItem;
