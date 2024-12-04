import React, {useEffect, useState} from 'react';

import styles from './FormItem.module.scss';
import FnText, {TFnText} from '@/ds/FnText';
import FNInput from '@/ds/FNInput';
import {
  Controller,
  FormProvider,
  RegisterOptions,
  useForm
} from 'react-hook-form';
import {Button} from '@/ds/Button';
import Select, {GroupBase, OptionsOrGroups} from 'react-select';
import FnRadioGroup from '@/ds/FnRadioGroup';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';
import {IRadioGroup} from '@/utils/interfaces/IRadioGroup';

export interface ISelectOptions {
  label: string;
  value?: string | number;
}

interface IProps {
  description?: string;
  displayType?: TFnText;
  editable?: boolean;
  endpoint: TMutation;
  isMulti?: boolean;
  name: string;
  options?: OptionsOrGroups<any, GroupBase<any>>;
  placeholder?: string;
  radioValues?: IRadioGroup[];
  social?:
    | 'twitter'
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'angelList'
    | 'whatsapp';
  title: string;
  type?: 'currency' | 'text' | 'number' | 'textarea' | 'radio' | 'percentage';
  url?: string;
  value?: string | number | ISelectOptions[] | ISelectOptions;
  registerOptions?: RegisterOptions;
  required?: boolean;
}

export const FormItem: React.FC<IProps> = props => {
  const {
    description,
    displayType = 'heading-xxSmall',
    editable = true,
    endpoint,
    isMulti,
    name,
    options,
    radioValues,
    placeholder,
    registerOptions,
    required,
    title,
    type = 'text',
    value,
    url
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

  const onSubmit = async (data: any) => {
    const key = Object.keys(data)[0];

    const formatData = () => {
      if (options) {
        if (isMulti) {
          return {
            [key]: data[name]?.map((item: ISelectOptions) => item.value)
          };
        } else {
          return {[key]: data[key].value};
        }
      } else if (data[key] === 'true') {
        return {[key]: true};
      } else if (data[key] === 'false') {
        return {[key]: false};
      } else {
        return data;
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

  const displayValue = Array.isArray(value)
    ? Object.values(value)
        .map(item => item?.label ?? item)
        .join(', ')
    : typeof value === 'object'
    ? (value as ISelectOptions)?.label
    : typeof value === 'boolean'
    ? value === true
      ? 'Yes'
      : 'No'
    : typeof value === 'number'
    ? value?.toLocaleString()
    : type === 'number'
    ? Number(value).toLocaleString()
    : type === 'currency'
    ? `$${Number(value).toLocaleString()}`
    : type === 'percentage'
    ? `${Number(value).toLocaleString()}%`
    : value;

  if (edit && editable) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              {options ? (
                <div className={styles.selectContainer}>
                  <FnText>{title}</FnText>
                  {description && (
                    <FnText className={styles.description}>
                      {description}
                    </FnText>
                  )}
                  <Controller
                    control={methods.control}
                    name={name}
                    render={({field: {onChange, value}}) => {
                      const selectValue =
                        Array.isArray(value) && value[0]?.label
                          ? value
                          : Array.isArray(value)
                          ? value.map(v => ({label: v, value: v}))
                          : value?.label
                          ? value
                          : {label: value, value};

                      return (
                        <Select
                          className={styles.select}
                          onChange={onChange}
                          options={options}
                          isMulti={isMulti}
                          value={selectValue}
                        />
                      );
                    }}
                  />
                </div>
              ) : radioValues ? (
                <FnRadioGroup
                  label={title}
                  description={description}
                  name={name}
                  options={radioValues}
                />
              ) : (
                <FNInput
                  registerOptions={registerOptions}
                  topLeftRounded
                  topRightRounded
                  bottomLeftRounded
                  bottomRightRounded
                  description={description}
                  label={title}
                  name={name}
                  placeholder={placeholder}
                  type={type}
                  required={required}
                />
              )}
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
        <FnText url={url} bold type="heading-xxSmall">
          {title}
        </FnText>
        <FnText url={url} type={displayType}>
          {!!displayValue ? displayValue : 'Not listed'}
        </FnText>
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};

export default FormItem;
