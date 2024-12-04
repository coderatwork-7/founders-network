import React, {useId, useState} from 'react';
import ReactSelect, {components, createFilter} from 'react-select';
import StateManagedSelect from 'react-select/dist/declarations/src/stateManager';
import classes from '../forms/functionEditforms.module.scss';
import clsx from 'clsx';
import CreatableSelect from 'react-select/creatable';
import {WindowedMenuList} from 'react-windowed-select';

export const FUNCTION_SELECT_CLASSES = {
  control: () => clsx(classes.control, 'form-control py-0'),
  placeholder: () => classes.placeholder,
  valueContainer: (state: any) => (state.hasValue ? 'py-2' : 'py-0'),
  indicatorSeparator: ({hasValue}: any) =>
    clsx(classes.btnSeparator, !hasValue && 'd-none'),
  multiValueLabel: () => classes.tag,
  clearIndicator: () => classes.removeBtn,
  input: () => clsx('my-0 py-0', classes.selectValue),
  singleValue: () => classes.selectValue,
  menu: () => classes.zIndex2
};

const getNoOptionsMessage = ({inputValue}: {inputValue: string}) =>
  inputValue?.length ? (
    'No Matches Found'
  ) : (
    <div className="text-danger">Error fetching Tags</div>
  );

const BasicSelect: StateManagedSelect = props => {
  const [input, setInput] = useState('');
  return (
    <ReactSelect
      isClearable={false}
      instanceId={useId()}
      menuShouldScrollIntoView={false}
      loadingMessage={() => 'Loading'}
      noOptionsMessage={getNoOptionsMessage}
      classNames={FUNCTION_SELECT_CLASSES}
      filterOption={createFilter({ignoreAccents: false})}
      styles={{
        indicatorSeparator: props.isClearable
          ? undefined
          : () => ({display: 'none'})
      }}
      components={
        (props.options?.length ?? 0) > 800
          ? {MenuList: WindowedMenuList}
          : undefined
      }
      inputValue={input}
      onInputChange={setInput}
      onBlur={() => setInput('')}
      {...props}
      className={clsx(classes.selectInput, props.className)}
    />
  );
};

const SelectWithAdd: CreatableSelect = props => {
  return (
    <CreatableSelect
      isClearable={false}
      instanceId={useId()}
      menuShouldScrollIntoView={false}
      loadingMessage={() => 'Loading'}
      classNames={FUNCTION_SELECT_CLASSES}
      noOptionsMessage={getNoOptionsMessage}
      styles={{
        indicatorSeparator: () => ({display: props.isClearable ? '' : 'none'})
      }}
      {...props}
      filterOption={createFilter({ignoreAccents: false})}
      className={clsx(classes.selectInput, props.className)}
      components={
        (props.options?.length ?? 0) > 800
          ? {MenuList: WindowedMenuList}
          : undefined
      }
    />
  );
};

export {BasicSelect, SelectWithAdd};
