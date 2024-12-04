import React, {useState} from 'react';

import styles from './FormItem.module.scss';
import FnText, {TFnText} from '@/ds/FnText';

import {FormProvider, useForm, useWatch} from 'react-hook-form';
import {Button} from '@/ds/Button';

import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';
import {toast} from 'react-toastify';
import {ErrorMessage} from '@hookform/error-message';
import InputErrorMessage from '@/ds/InputErrorMessage';

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
  editable?: boolean;
  displayType?: TFnText;
}

export const PasswordFormItem: React.FC<IProps> = props => {
  const {
    description,
    displayType = 'heading-xxSmall',
    editable = true,
    endpoint,
    name,
    placeholder,
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

  const methods = useForm();
  let pwd = useWatch({
    control: methods.control,
    name: 'password',
    defaultValue: ''
  });

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  const mutation = useGetMutationFunction(endpoint);

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Password and Confirm password must match');
    }
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

  const displayValue = 'udpate display value logic';
  //   const passwordRef = useRef({});

  //   passwordRef.current = methods.watch('password', '');

  const register = methods.register;
  if (edit && editable) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              <div className={styles.passwordInputContainer}>
                <label>
                  Password
                  <span className={styles.required}>*</span>
                </label>

                <input
                  className={styles.passwordInput}
                  {...register('password', {
                    required: {value: true, message: 'This field is required'}
                  })}
                />
              </div>
              <div className={styles.passwordInputContainer}>
                <label>
                  Confirm password
                  <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.passwordInput}
                  {...register('confirmPassword', {
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    // pattern: {
                    //   value:
                    //     /\^(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/,
                    //   message:
                    //     'Password must contain one special character and one number.'
                    // },
                    validate: value =>
                      value === pwd || 'The passwords do not match',
                    required: {value: true, message: 'This field is required'}
                  })}
                />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name={'confirmPassword'}
                  render={({message}) => (
                    <InputErrorMessage message={message} />
                  )}
                />
              </div>
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
        <FnText bold type="heading-xxSmall">
          {title}
        </FnText>
        <FnText type="body" bold>
          ******
        </FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default PasswordFormItem;
