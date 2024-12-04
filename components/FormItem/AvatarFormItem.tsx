import React, {useState} from 'react';

import styles from './FormItem.module.scss';
import FnText from '@/ds/FnText';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/ds/Button';

import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

import Avatar from '@/ds/Avatar/avatar';
import {AvatarType, AvatarWithButton} from '../Intro/avatarWithButton';
import {useSession} from 'next-auth/react';
import {toast} from 'react-toastify';

import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';
import AvatarEditor from '../AvatarEditor';

export interface ISelectOptions {
  label: string;
  value?: string | number;
}

interface IProps {
  description?: string;
  name: string;
  placeholder?: string;
  title?: string;
  value?: string;
  endpoint: TMutation;
  editable?: boolean;
}

export const AvatarFormItem: React.FC<IProps> = props => {
  const {description, editable = true, endpoint, name, title, value} = props;

  const {update} = useSession();
  const userInfo = useSelector(selectUserInfo());

  const [edit, setEdit] = useState(false);

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
    try {
      mutation.mutate(data);

      if (mutation.isSuccess) {
        setEdit(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUploadAvatar = () => {
    (URL: string) => {
      methods.setValue(name, URL);
      update({avatarUrl: URL});
    };
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
              <FnText>{title}</FnText>
              {description && (
                <FnText className={styles.description}>{description}</FnText>
              )}
              <Controller
                control={methods.control}
                name={name}
                render={({field: {onChange}}) => (
                  <AvatarEditor type="profileAvatar" imageUrl={value} />
                )}
              />
              <button onClick={handleClick} className={styles.editButton}>
                Cancel
              </button>
            </div>
            <Button type="submit" className={styles.submitButton}>
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
      <div className={styles.avatarContainer}>
        {title && (
          <FnText type="heading-xxSmall" bold>
            {title}
          </FnText>
        )}
        <Avatar
          newDesign={true}
          avatarUrl={value}
          altText={'Profile Image'}
          imageHeight={150}
          imageWidth={150}
          badge="none"
        />
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default AvatarFormItem;
