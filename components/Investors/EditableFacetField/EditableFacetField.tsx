import React, {useEffect, useState} from 'react';
import classes from './EditableFacetField.module.scss';
import {PopoverFacet} from '@/ds/PopoverFacet';
import {PopoverFacetProps} from '@/ds/PopoverFacet/popoverFacet';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {faXmark, faCheck, faPencil} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import {Tooltip} from '@/ds/Tooltip';
import {Spinner} from '@/ds/Spinner';
import {joinStringList} from '@/utils/common/helper';

interface EditableFieldProps {
  label: string;
  labelInfo?: string;
  value?: any;
  searchable?: boolean;
  multiSelect?: boolean;
  onUpdate?: () => void;
  onCancel?: () => void;
  defaultEditElement?: React.ReactNode;
  facetItem?: any;
  selectedFacetValues?: any;
  updateValue?: any;
  activeField?: string;
  setActiveField?: React.Dispatch<React.SetStateAction<string>>;
  loading?: boolean;
}

export const EditableFacetField = ({
  label,
  labelInfo,
  value,
  searchable = false,
  multiSelect = false,
  onUpdate,
  onCancel,
  defaultEditElement,
  facetItem,
  selectedFacetValues,
  updateValue,
  activeField,
  setActiveField,
  loading
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isMobile = Breakpoint.mobile === useBreakpoint();

  useEffect(() => {
    if (activeField !== label) {
      onCancel?.();
      setEditing(false);
    }
  }, [activeField]);

  const getSelectedValue = () =>
    (
      Object.values(
        selectedFacetValues?.[facetItem?.facet?.key] ?? {}
      )[0] as any
    )?.facetValueName;

  const getSelectedTags = () => {
    return Object.values(selectedFacetValues?.[facetItem.facet.key] ?? {}).map(
      (item: any) => (
        <button
          key={item.facetValueKey}
          className={classes.tagButton}
          onClick={e => {
            e.stopPropagation();
            updateValue?.(
              {
                [facetItem.facet.key]: {
                  [item.facetValueKey]: {}
                }
              },
              true
            );
          }}
        >
          <div className="text-truncate">{item?.facetValueName}</div>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )
    );
  };

  const getValue = () => {
    if (multiSelect && !value) {
      return joinStringList(
        Object.values(selectedFacetValues?.[facetItem?.facet?.key] ?? {}).map(
          (item: any) => item.facetValueName.replace(/ /g, '\u00a0')
        )
      );
    }
    return value;
  };

  const handleFacetClick = (obj: any, isMultiselect: boolean) => {
    if (!isMultiselect) setShowDropdown(false);
    updateValue(obj, isMultiselect);
  };

  const handleEdit = () => {
    setActiveField?.(label);
    setEditing(true);
  };

  const handleSave = () => {
    onUpdate?.();
  };

  const handleCancel = () => {
    onCancel?.();
    setEditing(false);
    setActiveField?.('');
  };

  const editElem =
    defaultEditElement ??
    (facetItem ? (
      <>
        <div
          className={multiSelect ? classes.tagsList : classes.selectValue}
          onClick={() => setShowDropdown(v => !v)}
        >
          {multiSelect ? getSelectedTags() : getSelectedValue()}
        </div>
        {showDropdown && (
          <>
            <div className={classes.selectDropdown}>
              <PopoverFacet
                facetKey={facetItem.facet.key}
                facetName={facetItem.facet.name}
                facetValueOnClick={handleFacetClick}
                isMultiselect={multiSelect}
                isSearchable={searchable}
                facetValues={facetItem.facetValues.map(
                  ({
                    key,
                    count,
                    name
                  }: any): Exclude<
                    PopoverFacetProps['facetValues'],
                    undefined
                  >[0] => ({
                    facetValueKey: key,
                    facetValueName: name,
                    facetValueCount: count
                  })
                )}
                selectedItems={selectedFacetValues}
                showWithoutPopover
                hideCount
              />
            </div>
            <div
              className={clsx([
                classes.backdrop,
                'offcanvas-backdrop bg-transparent',
                'show'
              ])}
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </>
    ) : (
      <input
        type="text"
        name="Stage"
        className="ps-2"
        value={value}
        onChange={updateValue}
      />
    ));

  return (
    <div className={classes.field}>
      <div className={classes.label}>
        <span>{label}</span>
        {labelInfo && (
          <Tooltip
            popover={labelInfo}
            mode={isMobile ? 'click' : 'hover'}
            fixedPosition={!isMobile}
          />
        )}
      </div>
      <div className={classes.value}>
        {editing ? (
          <>
            <div
              className={clsx(
                classes.editElem,
                !defaultEditElement && 'align-self-start'
              )}
            >
              {editElem}
            </div>
            <div className={clsx([classes.icons])}>
              {loading && activeField === label ? (
                <Spinner className={classes.loader} />
              ) : (
                <>
                  <FontAwesomeIcon
                    className={classes.icon}
                    icon={faXmark}
                    onClick={handleCancel}
                  />
                  {!defaultEditElement && (
                    <FontAwesomeIcon
                      className={classes.icon}
                      icon={faCheck}
                      onClick={handleSave}
                    />
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="ms-auto text-end ps-3">{getValue()}</span>
            <div className={clsx([classes.icons])}>
              <FontAwesomeIcon
                className={clsx([classes.icon], 'fs-6')}
                icon={faPencil}
                onClick={handleEdit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
