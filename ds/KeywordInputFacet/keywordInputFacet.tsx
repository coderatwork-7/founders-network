import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject
} from 'react';
import styles from './keywordInputFacet.module.scss';
import clsx from 'clsx';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import useIsMobile from '@/utils/common/useIsMobile';
import {DropdownItem} from '@/types/dropdown';
import {IconWrapper} from '../Icons/iconWrapper';
import {FacetProps, FacetState, FacetValue} from '@/utils/common/commonTypes';

function processFacetObject(
  obj: FacetState,
  totalKeywords: MutableRefObject<number>,
  selectedItemsRef: MutableRefObject<{[key: string]: boolean}>,
  setApplyFacets?: React.Dispatch<React.SetStateAction<boolean>>,
  ignoredFacetKeys?: {[key: string]: true},
  ignoredFacetValueKeys?: {[key: string]: true}
) {
  selectedItemsRef.current = {};
  const array: (FacetValue & {
    facetKey: string;
    displayOrder?: number;
  })[] = [];
  Object.keys(obj ?? {}).forEach(facetKey => {
    Object.keys(obj[facetKey] ?? {}).forEach(facetValueKey => {
      array.push({...obj[facetKey][facetValueKey], facetKey});
      selectedItemsRef.current[facetValueKey] = true;
    });
  });

  array.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  if (
    !array.some(
      element =>
        !ignoredFacetKeys?.[element.facetKey] &&
        !ignoredFacetValueKeys?.[element.facetValueKey]
    ) &&
    totalKeywords.current > array.length
  ) {
    setApplyFacets?.(true);
  }
  totalKeywords.current = array.length;
  return array;
}
export interface KeywordInputFacetProps<T extends DropdownItem>
  extends FacetProps<FacetValue> {
  labelText?: string;
  icon?: IconProp;
  limitTags?: number;
  placeholderText?: string;
  dropdownItems?: {[key: string]: T};
  ignoredFacetKeys: {[key: string]: true};
  ignoredFacetValueKeys?: {[key: string]: true};
  dropdownOnly?: boolean;
  fallbackDropdownText?: string;
  maxDropdownSize?: number;
  facetDropdown?: boolean;
  innerClasses?: string;
  setApplyFacets?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KeywordInputFacet = <T extends DropdownItem>({
  labelText,
  icon,
  limitTags,
  placeholderText,
  dropdownItems,
  facetKey,
  selectedItems,
  facetName,
  facetValueOnClick,
  ignoredFacetKeys,
  dropdownOnly = false,
  fallbackDropdownText,
  maxDropdownSize = 4,
  ignoredFacetValueKeys,
  facetDropdown,
  innerClasses,
  setApplyFacets = () => {}
}: KeywordInputFacetProps<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItemsRef = useRef<{[key: string]: boolean}>({});
  const dropdownRef = useRef<HTMLUListElement>(null);
  const isMobile = useIsMobile();
  const totalKeywords = useRef(0);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  useEffect(() => {
    setShowDropdown(inputValue.length > 0);
  }, [inputValue]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const handleSearchFacetSelect = (data: string | DropdownItem) => {
    if (dropdownOnly && typeof data === 'string') return null;
    facetValueOnClick?.(
      typeof data === 'string'
        ? {
            [facetKey ?? 'searchFacet']: {
              [data]: {
                facetValueKey: data,
                facetValueName: data
              }
            }
          }
        : {
            [facetKey ?? 'searchFacet']: {
              [data.id]: {
                ...data,
                facetValueKey: data.id,
                facetValueName: data.name
              }
            }
          },
      true
    );
    setInputValue('');
    setShowDropdown(false);
  };
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && inputValue.trim() !== '') {
        handleSearchFacetSelect(inputValue);
      }
    },
    [handleSearchFacetSelect, inputValue]
  );

  const handleClickOutsideDropdown = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  }, []);

  const renderDropdown = () => {
    const dropdown =
      dropdownItems &&
      Object.values(dropdownItems)
        .filter(item =>
          item.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, maxDropdownSize)
        .map(item => (
          <li
            key={item.id}
            className={clsx(
              facetDropdown &&
                selectedItemsRef.current[item.id] &&
                styles.disabled
            )}
            onClick={
              !selectedItemsRef.current[item.id] || !facetDropdown
                ? () => handleSearchFacetSelect(item)
                : undefined
            }
          >
            {item.name}
          </li>
        ));
    return (
      showDropdown && (
        <ul
          ref={dropdownRef}
          tabIndex={-1}
          className={clsx(
            'p-0',
            'text-wrap',
            styles.dropdown,
            isMobile && styles.mobile
          )}
        >
          {(dropdown?.length && dropdown) ||
            (fallbackDropdownText && (
              <li
                onClick={() =>
                  inputValue &&
                  handleSearchFacetSelect({
                    id: `new_tag${new Date().getTime()}`,
                    name: inputValue
                  })
                }
              >
                {fallbackDropdownText}
              </li>
            ))}
        </ul>
      )
    );
  };
  return (
    <div
      className={clsx(
        styles.wrapper,
        'd-flex',
        'align-items-center',
        innerClasses ? 'px-1' : 'px-3',
        'w-100'
      )}
    >
      <div className="align-self-center">
        {icon && <IconWrapper icon={icon} className={clsx('fa-1x', 'pe-2')} />}
        {labelText && (
          <label className={clsx('pe-2', 'text-nowrap')}>{labelText}</label>
        )}
      </div>

      <div
        className={clsx(
          innerClasses,
          'd-flex',
          'align-items-center',
          'gap-1',
          !innerClasses && 'p-2',
          'flex-wrap',
          'text-truncate',
          'w-100'
        )}
      >
        {processFacetObject(
          selectedItems ?? {},
          totalKeywords,
          selectedItemsRef,
          setApplyFacets,
          ignoredFacetKeys,
          ignoredFacetValueKeys
        ).map(
          element =>
            !ignoredFacetKeys?.[element.facetKey] &&
            !ignoredFacetValueKeys?.[element.facetValueKey] && (
              <div
                key={`${element.facetKey}_${element.facetValueKey}`}
                className={clsx(
                  'd-flex',
                  'align-items-center',
                  'py-0',
                  'px-2',
                  'rounded-1',
                  'mw-100',
                  styles.keyword
                )}
              >
                <span className={clsx('text-truncate')}>
                  {element.facetValueName || element.facetValueKey}
                </span>
                <div
                  className={clsx(
                    'ms-1',
                    'bg-transparent',
                    'border-0',
                    'px-1',
                    'd-flex align-item-center'
                  )}
                  onClick={() =>
                    facetValueOnClick?.(
                      {
                        [element.facetKey]: {
                          [element.facetValueKey]: {
                            ...element,
                            facetValueKey: element.facetValueKey,
                            facetValueName: element.facetValueName
                          }
                        }
                      },
                      true
                    )
                  }
                >
                  <div
                    className={clsx('btn-close cursorPointer', styles.crossBtn)}
                  ></div>
                </div>
              </div>
            )
        )}
        {!limitTags || totalKeywords.current < limitTags ? (
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(true)}
              placeholder={placeholderText}
              className={clsx('w-100', 'border-0', 'px-2', styles.input)}
            />
            {renderDropdown()}
          </div>
        ) : null}
      </div>
    </div>
  );
};
