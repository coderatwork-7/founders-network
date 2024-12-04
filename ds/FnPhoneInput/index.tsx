import React, {useId, useState} from 'react';
import Select from 'react-select';
import {get} from 'lodash';

import styles from './FnPhoneInput.module.scss';
import FNInput, {IFNInputProps} from '../FNInput';
import {COUNTRIES} from '@/utils/data';
import clsx from 'clsx';
import {Controller, useFormContext} from 'react-hook-form';

interface IProps extends IFNInputProps {}

export const FnPhoneInput: React.FC<IProps> = props => {
  const {name} = props;

  const {
    control,
    setValue,
    formState: {errors}
  } = useFormContext();

  type KeyOfCountries = keyof typeof COUNTRIES;

  const getCountryJSX = (
    bgpos: string,
    height: string,
    width: string,
    country: string,
    code: string,
    displayCountry = true
  ) => (
    <div>
      <div
        style={{
          display: 'inline-block',
          backgroundImage: 'url(/images/flags.png)',
          backgroundPosition: bgpos,
          height,
          width
        }}
      />
      {displayCountry && <span>{country}</span>}
      <span
        className={clsx(styles.grayColor, 'textXSmall')}
      >{`  (${code})`}</span>
    </div>
  );

  const countriesDropdown = Object.keys(COUNTRIES).map(country => ({
    value: `${country}_${COUNTRIES[country as KeyOfCountries].code}`,
    label: getCountryJSX(
      COUNTRIES[country as KeyOfCountries].bgpos,
      COUNTRIES[country as KeyOfCountries].height,
      COUNTRIES[country as KeyOfCountries].width,
      country,
      COUNTRIES[country as KeyOfCountries].code
    )
  }));

  const controlStyles = (provided: any, state: any, extraStyles?: any) => ({
    ...provided,
    outline: 'none',
    boxShadow: 'none',

    border: '1px solid rgb(128,128,128,0.6)',
    borderRadius: '0',
    borderTop: 'none',
    textAlign: 'left',
    '& input': {
      boxShadow: 'none !important'
    },
    borderBottomLeftRadius: '.5rem',
    ...extraStyles
  });

  const reactInputStyles = {
    option: (provided: any) => ({
      ...provided,
      textAlign: 'left'
    }),
    control: (provided: any, state: any) => controlStyles(provided, state),
    input: (provided: any) => ({
      ...provided,
      marginLeft: 'auto',
      boxShadow: 'none',
      padding: '4px'
    })
  };

  const reactCountryInputStyles = {
    ...reactInputStyles,

    control: (provided: any, state: any) =>
      controlStyles(provided, state, {
        'div:first-child': {display: 'flex', alignItems: 'center'}
      }),
    menu: (provided: any) => ({
      ...provided,
      width: '300%',
      '@media only screen and (max-width: 600px)': {
        width: '100%'
      }
    })
  };

  const SingleValue = (props: any) => {
    const country = props?.data?.value?.split?.('_')?.[0];
    return getCountryJSX(
      COUNTRIES[country as KeyOfCountries].bgpos,
      COUNTRIES[country as KeyOfCountries].height,
      COUNTRIES[country as KeyOfCountries].width,
      country,
      COUNTRIES[country as KeyOfCountries].code,
      false
    );
  };

  return (
    <div className={styles.FnPhoneInput}>
      <Controller
        control={control}
        name={`countryCode`}
        render={({field: {onChange, value}}) => {
          if (!value)
            setValue('countryCode', {
              label: getCountryJSX(
                '-5263px 0px',
                '11px',
                '20px',
                'United States',
                '+1'
              ),
              value: `United States_+1`
            });
          return (
            <Select
              onChange={onChange}
              options={countriesDropdown}
              className={clsx(styles.countrySelect)}
              styles={reactCountryInputStyles}
              placeholder="Select Country code"
              instanceId={useId()}
              defaultValue={{
                label: getCountryJSX(
                  '-5263px 0px',
                  '11px',
                  '20px',
                  'United States',
                  '+1'
                ),
                value: `United States_+1`
              }}
              components={{SingleValue}}
            />
          );
        }}
      />
      <FNInput
        bottomRightRounded
        {...props}
        bottomLeftRounded={false}
        placeholder="Phone"
        inputMode="tel"
        borderLeft={false}
        isPhone
      />
    </div>
  );
};

export default FnPhoneInput;
