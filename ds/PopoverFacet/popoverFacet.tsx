import classes from './popoverFacet.module.scss';
import {Popover} from '@/ds/Popover';
import clsx from 'clsx';
import React, {useEffect, useMemo, useState} from 'react';
import {FacetProps, FacetValue} from '@/utils/common/commonTypes';
import {Checkbox, CheckboxSize} from '../Checkbox';
import useIsMobile from '@/utils/common/useIsMobile';

interface PopoverFacetValue extends FacetValue {
  facetValueCount?: string;
  facetValueColor?: string;
  [additional: string]: any;
}
export interface PopoverFacetProps extends FacetProps<PopoverFacetValue> {
  isMultiselect: boolean;
  isSearchable?: boolean;
  showSelected?: boolean;
  trigger?: 'hover' | 'click';
  startingFacet?: boolean;
  showWithoutPopover?: boolean;
  hideCount?: boolean;
}

export function PopoverFacet({
  facetName,
  facetKey,
  facetValues,
  isMultiselect = false,
  isSearchable = false,
  facetValueOnClick,
  selectedItems = {},
  showSelected = false,
  trigger = 'hover',
  startingFacet = false,
  showWithoutPopover = false,
  hideCount = false
}: PopoverFacetProps) {
  const [searchText, setSearchText] = useState('');
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();
  let popover = useMemo(
    () => (
      <>
        {isSearchable && (
          <div
            className={clsx(
              'justify-content-center',
              classes.input,
              'mt-2',
              'd-flex'
            )}
          >
            <input
              type="text"
              placeholder={facetName}
              defaultValue={searchText}
              onChange={event =>
                setSearchText(event.currentTarget.value.toLowerCase())
              }
            />
          </div>
        )}
        <div
          className={clsx(
            classes.popover,
            showWithoutPopover && classes.withoutPopover,
            facetValues &&
              facetValues.length &&
              facetValues[0].facetValueColor &&
              classes.colorful
          )}
        >
          {(isSearchable
            ? (facetValues ?? []).filter(element =>
                element?.facetValueName.toLowerCase().includes(searchText)
              )
            : facetValues ?? []
          ).map(element => (
            <div
              key={element.facetValueKey}
              className={clsx(
                element.facetValueColor && classes.color,
                'd-flex justify-content-between align-items-center',
                selectedItems?.[facetKey]?.[element.facetValueKey] &&
                  classes.highlighted,
                classes[element.facetValueColor ?? '']
              )}
              onClick={() => {
                facetValueOnClick(
                  {
                    [facetKey]: {
                      [element.facetValueKey]: element
                    }
                  },
                  isMultiselect
                );
                if (!isMultiselect) setShow(false);
                if (isSearchable && !isMultiselect) setSearchText('');
              }}
            >
              <span
                className={clsx(
                  'd-flex  align-items-center',
                  classes.facetValueName
                )}
              >
                {isMultiselect && (
                  <Checkbox
                    onChange={() => {}}
                    checked={
                      !!selectedItems?.[facetKey]?.[element.facetValueKey]
                    }
                    withLabel={false}
                    size={CheckboxSize.Small}
                    className={classes.checkbox}
                  />
                )}
                <span className="d-flex  align-items-center">
                  {element.facetValueColor && (
                    <span className={clsx(classes.before, 'me-2')}></span>
                  )}
                  {element.facetValueName}
                </span>
              </span>
              {!hideCount && <span>{element.facetValueCount}</span>}
            </div>
          ))}
        </div>
      </>
    ),
    [
      facetName,
      facetKey,
      facetValues,
      isMultiselect,
      isSearchable,
      facetValueOnClick,
      searchText,
      selectedItems,
      showSelected,
      trigger,
      startingFacet,
      searchText
    ]
  );

  if (showWithoutPopover) return popover;

  useEffect(() => {
    setSearchText('');
  }, [show]);

  return (
    <Popover
      mode="hover"
      placement={startingFacet ? 'bottom-start' : 'bottom'}
      popover={popover}
      hideArrow
      show={show}
      setShow={setShow}
      popoverClass="rounded-bottom"
      flatTop
    >
      <div
        className={clsx(
          'd-inline-flex justify-content-between align-items-center',
          classes.container
        )}
      >
        <span
          className={clsx(
            classes.facetName,
            startingFacet && !isMobile && 'ps-3'
          )}
        >
          {(showSelected &&
            Object.values(selectedItems?.[facetKey] ?? {})?.[0]
              ?.facetValueName) ||
            facetName}
        </span>
        <span className={show ? classes.arrowUp : classes.arrowDown}></span>
      </div>
    </Popover>
  );
}
