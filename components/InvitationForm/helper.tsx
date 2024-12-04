import Select from 'react-select';
import classes from './invitationForm.module.scss';
import {COUNTRIES, COUNTRIES_PLAIN} from '@/utils/data';
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useId,
  useMemo,
  useRef
} from 'react';
import clsx from 'clsx';
import isEmail from 'validator/lib/isEmail';
import valid from 'card-validator';
import {usePlacesWidget} from 'react-google-autocomplete';
import FNInput from '@/ds/FNInput';

export type Status = 'none' | 'ok' | 'wrong';

const controlStyles = (provided: any, state: any, extraStyles?: any) => ({
  ...provided,
  outline: 'none',
  boxShadow: 'none',
  border:
    state.menuIsOpen || state.isFocused
      ? '1px solid rgb(128,128,128)'
      : '1px solid rgb(128,128,128,0.6)',
  borderRadius: '2px',
  textAlign: 'left',
  '&:hover': {
    border: '1px solid rgb(128,128,128)'
  },
  '& input': {
    boxShadow: 'none !important'
  },
  ...extraStyles
});
export const reactInputStyles = {
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
export const reactCountryInputStyles = {
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
type KeyOfCountries = keyof typeof COUNTRIES;
export const getCountryJSX = (
  bgpos: string,
  height: string,
  width: string,
  country: string,
  code: string,
  displayCountry = true
) => (
  <div className="text-left">
    <div
      style={{
        display: 'inline-block',
        backgroundImage: 'url(/images/flags.png)',
        backgroundPosition: bgpos,
        height,
        width
      }}
      className="me-1"
    ></div>
    {displayCountry && <span>{country}</span>}
    <span
      className={clsx(classes.grayColor, 'textXSmall')}
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
export const SelectPhoneNumber = (props: any) => {
  const onChange = useMemo(
    () => (val: any) => {
      change(val?.value.split('_')[1], props.setState, 'profile', 'phoneCode');
      inputRef.current?.focus();
    },
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={clsx('d-flex w-100 align-items-center', classes.flexColumn)}
    >
      <Select
        options={countriesDropdown}
        styles={reactCountryInputStyles}
        placeholder="Select Country code"
        instanceId={useId()}
        defaultValue={
          props.defaultValue ?? {
            label: getCountryJSX(
              '-5263px 0px',
              '11px',
              '20px',
              'United States',
              '+1'
            ),
            value: `United States_+1`
          }
        }
        onChange={onChange}
        className={clsx(classes.w100, classes.marginRightMed, 'mt-2 w-50')}
        components={{SingleValue}}
      ></Select>
      <FNInput name="telephone" type="tel" />
      {/* <input
        ref={inputRef}
        type="tel"
        className="mt-2"
        value={props?.state?.profile?.phone?.value}
        onChange={e =>
          change(e.target.value, props.setState, 'profile', 'phone')
        }
        required
      /> */}
    </div>
  );
};

export const SelectTags = (props: any) => (
  <Select
    styles={reactInputStyles}
    isMulti
    instanceId={useId()}
    {...props}
  ></Select>
);

type Value<T> = {
  value: T;
};

interface UserProfile {
  firstName: Value<string>;
  lastName: Value<string>;
  email: Value<string>;
  // nominator: Value<string>;
  phoneCode: Value<string>;
  phone: Value<string>;
  // tags: Value<string[]>;
}

interface CompanyProfile {
  startUpName: Value<string>;
  website: Value<string>;
  dontHaveWebsites: Value<boolean>;
  companyAddress: Value<string>;
  city: Value<string>;
  state: Value<string>;
  zipCode: Value<string>;
  country: Value<string>;
  //companyDescription: Value<string>;
  techSectors: Value<number[]>;
  stage: Value<string>;
}

interface PaymentInfo {
  paymentPlanId: Value<string>;
  cardNumber: Value<string>;
  expirationDate: Value<string>;
  cvv: Value<string>;
  city: Value<string>;
  state: Value<string>;
  zipCode: Value<string>;
  country: Value<string>;
  streetAddress: Value<string>;
  sameAsCompanyAddress: Value<boolean>;
}

export interface State {
  profile: UserProfile;
  company: CompanyProfile;
  payment: PaymentInfo;
}

export function createInitialState<T>(defaultValue: T): Value<T> {
  return {value: defaultValue};
}

export const initialUserProfile: UserProfile = {
  firstName: createInitialState(''),
  lastName: createInitialState(''),
  email: createInitialState(''),
  // nominator: createInitialState(''),
  phone: createInitialState(''),
  phoneCode: createInitialState('+1')
  // tags: createInitialState([], true)
};

const initialCompanyProfile: CompanyProfile = {
  startUpName: createInitialState(''),
  website: createInitialState(''),
  dontHaveWebsites: createInitialState(false),
  companyAddress: createInitialState(''),
  city: createInitialState(''),
  state: createInitialState(''),
  zipCode: createInitialState(''),
  country: createInitialState('US'),
  // companyDescription: createInitialState(''),
  techSectors: createInitialState([]),
  stage: createInitialState('personal')
};

const initialPaymentInfo: PaymentInfo = {
  paymentPlanId: createInitialState(''),
  cardNumber: createInitialState(''),
  expirationDate: createInitialState(''),
  cvv: createInitialState(''),
  city: createInitialState(''),
  state: createInitialState(''),
  zipCode: createInitialState(''),
  country: createInitialState('US'),
  streetAddress: createInitialState(''),
  sameAsCompanyAddress: createInitialState(false)
};

export const initialState: State = {
  profile: initialUserProfile,
  company: initialCompanyProfile,
  payment: initialPaymentInfo
};

const getKeysObject = (initialState: any) =>
  Object.keys(initialState).reduce(
    (acc, key) => Object.assign(acc, {[key]: key}),
    {}
  );
export const keyofProfileState = getKeysObject(initialUserProfile) as {
  [key in keyof State['profile']]: key;
};

export const keyofCompanyState = getKeysObject(initialCompanyProfile) as {
  [key in keyof State['company']]: key;
};

export const keyofPaymentStata = getKeysObject(initialPaymentInfo) as {
  [key in keyof State['payment']]: key;
};

export const InputElement = forwardRef((props: any, ref: any) => (
  <input type="text" placeholder={props.placeholder} {...props} ref={ref} />
));

export const change = (
  value: any,
  setState: Dispatch<SetStateAction<State>>,
  page: keyof State,
  field: string
) =>
  setState(prev => ({
    ...prev,
    [page]: {
      ...prev[page],
      [field]: {
        ...(prev as any)[page][field],
        value,
        errorMessage: '',
        status: 'none'
      }
    }
  }));

export interface CheckBoxProps {
  setState: Dispatch<SetStateAction<State>>;
  state: State;
  fieldCheckbox: string;
  page: keyof State;
}
export interface InputWithCheckBoxProps extends CheckBoxProps {
  fieldInput: string;
}
export const InputWithCheckBox = ({
  setState,
  state,
  page,
  fieldCheckbox,
  fieldInput
}: InputWithCheckBoxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const onChangeCheckBox = useMemo(
    () => (e: any) => change(e.target.checked, setState, page, fieldCheckbox),
    [change, setState, page, fieldCheckbox]
  );
  const onChangeInput = useMemo(
    () => (e: any) => change(e.target.value, setState, page, fieldInput),
    [change, setState, page, fieldInput]
  );
  const toggle = () =>
    change(!checkboxRef.current?.checked, setState, page, fieldCheckbox);
  return (
    <>
      {!(state as any)[page][fieldCheckbox].value && (
        <input
          type="text"
          value={(state as any)[page][fieldInput].value}
          onChange={onChangeInput}
        />
      )}
      <div className="d-flex align-items-center justify-content-start gap-1 text-start mt-1 cursorPointer">
        <input
          type="checkbox"
          checked={(state as any)[page][fieldCheckbox].value}
          onChange={onChangeCheckBox}
          className={classes.checkbox}
          ref={checkboxRef}
        />
        <div onClick={toggle} onKeyDown={() => {}}>
          I don't have a website yet
        </div>
      </div>
    </>
  );
};

export const Checkbox = ({
  fieldCheckbox,
  page,
  setState,
  state
}: CheckBoxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const onChangeCheckBox = useMemo(
    () => (e: any) => change(e.target.checked, setState, page, fieldCheckbox),
    [change, setState, page, fieldCheckbox]
  );

  const toggle = () =>
    change(!checkboxRef.current?.checked, setState, page, fieldCheckbox);
  return (
    <div className="d-flex align-items-center justify-content-start gap-1 text-start mt-1 cursorPointer">
      <input
        type="checkbox"
        checked={(state as any)[page][fieldCheckbox].value}
        onChange={onChangeCheckBox}
        className={classes.checkbox}
        ref={checkboxRef}
      />
      <div onClick={toggle} onKeyDown={() => {}}>
        Click here for billing address to be same as company address
      </div>
    </div>
  );
};

export const PlainCountrySelect = (props: any) => {
  const onChange = useMemo(
    () => (val: any) =>
      change(
        val?.value,
        props.setState,
        props.page ?? 'company',
        props.field ?? 'country'
      ),
    [props.setState, props.page, props.field]
  );
  return (
    <Select
      options={COUNTRIES_PLAIN}
      styles={reactInputStyles}
      placeholder="Select Country"
      instanceId={useId()}
      defaultValue={
        props.defaultValue ?? {
          label: 'United States',
          value: 'US'
        }
      }
      onChange={onChange}
      value={props?.value}
    />
  );
};

export const createSelectTagProps = (
  setState: Dispatch<SetStateAction<State>>,
  page: keyof State,
  field: string
) => ({
  onChange: (value: {label: any; value: string}[]) =>
    change(
      value.map(e => e.value),
      setState,
      page,
      field
    )
});

export type SelectElementProps = Readonly<{
  options: {label: any; value: string}[];
  setState: Dispatch<SetStateAction<State>>;
  defaultValue?: {label: any; value: string};
  page: keyof State;
  field: string;
}>;
export const SelectElement = ({
  field,
  options,
  page,
  setState,
  defaultValue,
  ...props
}: SelectElementProps) => {
  const onChange = useMemo(
    () => (val: {label: any; value: string} | null) =>
      change(val?.value, setState, page, field),
    []
  );
  return (
    <Select
      options={options}
      onChange={onChange}
      defaultValue={defaultValue}
      styles={reactInputStyles}
      instanceId={useId()}
      {...props}
    />
  );
};
interface Membership {
  id: string;
  lifetimePlanId: string;
  name: string;
  employmentType: string[];
  dues: string;
  startDate: string;
  endDate: string;
  cancelDate: string;
  paymentPlan: ApiInputOptions;
}
type InputOptions = {label: string; value: string}[];
type ApiInputOptions = {id: number | string; name: string}[];
export interface ApiData {
  profile: {tags: ApiInputOptions; testimonials: any};
  company: {
    industorySectors: ApiInputOptions;
    techSectors: ApiInputOptions;
    stage: InputOptions;
  };
  payment: {paymentDetails: Membership[]};
  all: any;
}

export const changeApiData = (
  setApiData: Dispatch<SetStateAction<ApiData>>,
  fields: {[key: string]: {[key: string]: any}}
) => {
  setApiData(prev => ({
    ...prev,
    ...Object.keys(fields).reduce(
      (acc, page) =>
        Object.assign(acc, {
          [page]: {
            ...prev[page as keyof typeof prev],
            ...Object.keys((fields as any)[page]).reduce(
              (acc, field) =>
                Object.assign(acc, {[field]: (fields as any)[page]?.[field]}),
              {}
            )
          }
        }),
      {}
    )
  }));
};

export const changeError = (
  setState: Dispatch<SetStateAction<State>>,
  errorState: any,
  page: keyof State
) =>
  setState((prev: any) => ({
    ...prev,
    [page]: {
      ...prev[page],
      ...Object.keys(prev[page]).reduce(
        (acc: any, field: any) =>
          Object.assign(acc, {
            [field]: {
              ...prev[page][field],
              errorMessage: errorState?.[field] ?? '',
              status: errorState?.[field] ? 'wrong' : 'ok'
            }
          }),
        {}
      )
    }
  }));

export const pageStateToPayload = (pageState: any) =>
  Object.keys(pageState).reduce(
    (acc: any, field: any) =>
      Object.assign(acc, {[field]: pageState[field].value}),
    {}
  );
const apiTagsDataToState = (data: {id: any; name: any}[]) =>
  data.map(e => e.id.toString());

export const setStateFromData: (data: any) => State = data => {
  const {profile} = data;

  // Perform null checks before accessing properties
  const phoneSplit = profile?.phoneNumber?.split('-') || [];
  const phone = phoneSplit[1];
  const phoneCode = phoneSplit[0];

  return {
    profile: {
      email: createInitialState(data.profile?.email ?? ''),
      firstName: createInitialState(data.profile?.firstName ?? ''),
      lastName: createInitialState(data.profile?.lastName ?? ''),
      // nominator: createInitialState(data.profile?.nominator ?? ''),
      phone: createInitialState(phone ?? ''),
      phoneCode: createInitialState(phoneCode ?? '+1')
      // tags: createInitialState(apiTagsDataToState(data.profile?.tags ?? []))
    },
    company: {
      city: createInitialState(data.company?.city ?? ''),
      companyAddress: createInitialState(data.company?.companyAddress ?? ''),
      // companyDescription: createInitialState(data.company?.description ?? ''),
      companyDescription: '',
      country: createInitialState(data.company?.country ?? 'US'),
      dontHaveWebsites: createInitialState(
        data.company?.dontHaveWebsites ?? ''
      ),
      stage: createInitialState(data.company?.stage || 'personal'),
      startUpName: createInitialState(data.company?.startupName ?? ''),
      state: createInitialState(data.company?.state ?? ''),
      techSectors: createInitialState(
        apiTagsDataToState(data.company?.techSectors ?? [])
      ),
      website: createInitialState(data.company?.website ?? ''),
      zipCode: createInitialState(data.company?.zipCode ?? '')
    },
    payment: {
      cardNumber: createInitialState(data.payment?.cardNumber ?? ''),
      city: createInitialState(data.payment?.city ?? ''),
      country: createInitialState(data.payment?.country ?? 'US'),
      cvv: createInitialState(data.payment?.cvv ?? ''),
      expirationDate: createInitialState(data.payment?.expirationDate ?? ''),
      paymentPlanId: createInitialState(data.payment?.paymentPlanId ?? ''),
      state: createInitialState(data.payment?.state ?? ''),
      streetAddress: createInitialState(data.payment?.streetAddress ?? ''),
      zipCode: createInitialState(data.payment?.zipCode ?? ''),
      sameAsCompanyAddress: createInitialState(false)
    }
  };
};

export const searchCountryLabel = (countryCode: string) => {
  for (const label in COUNTRIES) {
    const country = COUNTRIES[label as KeyOfCountries];
    if (country.code === countryCode) {
      return {
        value: label + '_' + country.code,
        label: getCountryJSX(
          country.bgpos,
          country.height,
          country.width,
          label,
          country.code
        )
      };
    }
  }
  return null;
};

export const apiDataToOptions = (apiData: ApiInputOptions) =>
  apiData?.map?.(e => ({label: e.name, value: e.id}));

export const checkSameAndFill = (isSame: boolean, l: string, r: string) =>
  isSame ? l : r;

export const setSingleError = (
  setState: Dispatch<SetStateAction<State>>,
  page: keyof State,
  field: string,
  errorMessage: string
) =>
  setState(prev => ({
    ...prev,
    [page]: {
      ...prev[page],
      [field]: {
        ...(prev as any)[page][field],
        errorMessage
      }
    }
  }));

const checkNotBlank = (obj: any) => !!obj.value;
const unhandled = () => {
  throw new Error('Not configured to check this field');
  return true;
};
type ProfileInfo = keyof UserProfile;
type CompanyInfo = keyof CompanyProfile;
type ReviewInfo = keyof PaymentInfo;

export const profileValidate: {[key in ProfileInfo]: (val: any) => boolean} = {
  email: (val: UserProfile['email']) => isEmail(val.value),
  firstName: checkNotBlank,
  lastName: checkNotBlank,
  // nominator: checkNotBlank,
  phone: checkNotBlank,
  phoneCode: checkNotBlank
  //tags: () => true
};

export const companyValidate: {[key in CompanyInfo]: any} = {
  city: checkNotBlank,
  companyAddress: checkNotBlank,
  // companyDescription: checkNotBlank,
  country: checkNotBlank,
  stage: checkNotBlank,
  state: checkNotBlank,
  startUpName: checkNotBlank,
  techSectors: (array: any) => array.value.length > 0,
  zipCode: checkNotBlank,
  dontHaveWebsites: unhandled,
  website: (_: any, state: State) =>
    state.company.dontHaveWebsites.value || state.company.website.value
};

export const paymentValidate: {[key in ReviewInfo]: any} = {
  paymentPlanId: checkNotBlank,
  city: (_: any, state: State) =>
    !!checkSameAndFill(
      state.payment.sameAsCompanyAddress.value,
      state.company.city.value,
      state.payment.city.value
    ),
  state: (_: any, state: State) =>
    !!checkSameAndFill(
      state.payment.sameAsCompanyAddress.value,
      state.company.state.value,
      state.payment.state.value
    ),
  country: (_: any, state: State) =>
    !!checkSameAndFill(
      state.payment.sameAsCompanyAddress.value,
      state.company.country.value,
      state.payment.country.value
    ),
  streetAddress: (_: any, state: State) =>
    !!checkSameAndFill(
      state.payment.sameAsCompanyAddress.value,
      state.company.companyAddress.value,
      state.payment.streetAddress.value
    ),
  zipCode: (_: any, state: State) =>
    !!checkSameAndFill(
      state.payment.sameAsCompanyAddress.value,
      state.company.zipCode.value,
      state.payment.zipCode.value
    ),
  sameAsCompanyAddress: unhandled,
  cardNumber: (cardNum: Value<string>) => valid.number(cardNum.value).isValid,
  cvv: (cvv: Value<string>) => /^\d{3,4}$/.test(cvv.value),
  expirationDate: (exp: Value<string>) => {
    try {
      const split = exp.value.split('/');
      return (
        valid.expirationMonth(split[0]).isValid &&
        valid.expirationYear(split[1]).isValid
      );
    } catch (err) {
      return false;
    }
  }
};

export const validatePage = (
  pageState: any,
  validatorMap: any,
  state?: State
) =>
  Object.keys(pageState).reduce((acc: any, field: any) => {
    if (!validatorMap[field](pageState[field], state))
      acc[field] = 'Invalid or Empty Value';
    return acc;
  }, {});
