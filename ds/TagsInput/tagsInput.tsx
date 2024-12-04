import React, {useId} from 'react';
import {ClassNamesConfig, GroupBase} from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface TagsInputProps {
  placeholder?: string;
  classNames?: ClassNamesConfig<Option, true, GroupBase<Option>>;
  className?: string;
  value?: string[];
  handleUpdate?: (value: string[]) => void;
}

interface Option {
  readonly label: string;
  readonly value: string;
}

const components = {
  DropdownIndicator: null
};

const createOption = (label: string) => ({
  label,
  value: label
});

export const TagsInput: React.FC<TagsInputProps> = ({
  placeholder = 'Type something and press enter...',
  classNames,
  className,
  value,
  handleUpdate
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const normalizedValue = (value ?? []).map(label => createOption(label));

  const updateValue = (normalizedValue: readonly Option[]) => {
    handleUpdate?.(normalizedValue.map(v => v.value));
  };

  const saveInput = (event?: any) => {
    if (!inputValue) return;
    if (['Enter', 'Tab', undefined].includes(event?.key)) {
      updateValue([
        ...normalizedValue,
        ...inputValue
          .split(',')
          .filter(val => val.trim())
          .filter(val => !value?.includes(val))
          .map(val => createOption(val.trim()))
      ]);
      setInputValue('');
      event?.preventDefault();
    }
  };

  return (
    <CreatableSelect
      instanceId={useId()}
      components={components}
      isClearable={false}
      isMulti
      menuIsOpen={false}
      onKeyDown={saveInput}
      placeholder={placeholder}
      value={normalizedValue}
      inputValue={inputValue}
      onChange={newValue => {
        updateValue(newValue);
      }}
      onInputChange={newValue => setInputValue(newValue)}
      onBlur={() => saveInput()}
      classNames={classNames}
      className={className}
    />
  );
};
