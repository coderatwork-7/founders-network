import React, {useState} from 'react';

import styles from './FormItem.module.scss';
import FnText from '@/ds/FnText';
import FNInput from '@/ds/FNInput';
import {FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/ds/Button';

import Select, {GroupBase, OptionsOrGroups} from 'react-select';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';

interface IBillingAddress {
  billing_address?: string;
  billing_city?: string;
  billing_country?: string;
  billing_state?: string;
  billing_zipcode?: string;
}

export interface ISelectOptions {
  label: string;
  value?: string | number;
}

interface IProps {
  description?: string;
  title: string;
  value: IBillingAddress;
  endpoint: TMutation;
  editable?: boolean;
  type?: 'text' | 'number' | 'textarea';
}

export const AddressFormItem: React.FC<IProps> = props => {
  const {
    description,
    editable = true,
    endpoint,
    title,
    type = 'text',
    value
  } = props;
  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(false);

  const methods = useForm({
    defaultValues: {billingAddress: value}
  });

  const mutation = useGetMutationFunction(endpoint);

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

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

  const cityStateZip = () => {
    if (value?.billing_city && value?.billing_state) {
      return `${value.billing_city}, ${value.billing_state} ${value.billing_zipcode}`;
    } else {
      return 'Not listed';
    }
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
              <div className={styles.inputsContainer}>
                <div>
                  <FnText>{title}</FnText>
                  {description && (
                    <FnText className={styles.description}>
                      {description}
                    </FnText>
                  )}
                </div>
                <div className={styles.addressRow}>
                  <FNInput
                    topLeftRounded
                    topRightRounded
                    bottomLeftRounded
                    bottomRightRounded
                    label="Street"
                    name="billingAddress.billing_address"
                    placeholder="Enter your billing address"
                    type={type}
                  />
                </div>
                <div className={styles.addressRow}>
                  <FNInput
                    topLeftRounded
                    bottomLeftRounded
                    label="City"
                    name="billingAddress.billing_city"
                    placeholder="Enter your billing city"
                    type={type}
                    borderRight={false}
                  />
                  <FNInput
                    topRightRounded
                    bottomRightRounded
                    label="State or Region"
                    name="billingAddress.billing_state"
                    placeholder="Enter your billing state or region"
                    type={type}
                    borderRight={false}
                  />
                </div>
                <div className={styles.addressRow}>
                  <FNInput
                    topLeftRounded
                    bottomLeftRounded
                    label="Country"
                    name="billingAddress.billing_country"
                    placeholder="Enter your billing country"
                    type={type}
                    borderRight={false}
                  />
                  <FNInput
                    topRightRounded
                    bottomRightRounded
                    label="Zip Code"
                    name="billingAddress.billing_zipcode"
                    placeholder="Enter your billing zip code."
                    type={type}
                  />
                </div>
              </div>

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
        <FnText>{value.billing_address}</FnText>
        <FnText>{cityStateZip()}</FnText>
        <FnText>{`${value.billing_country}`}</FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default AddressFormItem;
