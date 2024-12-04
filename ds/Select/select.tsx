import React, {useEffect, useState} from 'react';
import classes from './select.module.scss';
import clsx from 'clsx';

interface SelectProps {
  items: Array<any>;
  mode?: 'hover' | 'click';
  matchInputWidth?: boolean;
  className?: string;
  itemClass?: string;
  dropdownClass?: string;
  onChange?: (key: any) => void;
  defaultVal?: any;
}

export const Select = ({
  items,
  mode = 'click',
  matchInputWidth = true,
  className,
  itemClass,
  dropdownClass,
  onChange = _ => {},
  defaultVal
}: SelectProps) => {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultVal ?? items[0]);
  let hoverProps = {};
  let clickProps = {};

  useEffect(() => {
    onChange(selectedItem.props?.['select-key'] ?? selectedItem);
  }, [selectedItem]);

  if (mode === 'hover') {
    hoverProps = {
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false)
    };
  } else if (mode === 'click') {
    clickProps = {
      onClick: () => setShow(v => !v)
    };
  }

  return (
    <>
      <span
        className={clsx(classes.select, show && classes.show, className)}
        {...hoverProps}
        {...clickProps}
      >
        <span className="text-truncate z-2">
          {selectedItem ?? defaultVal ?? items[0]}
        </span>
        {show && (
          <div
            className={clsx([
              classes.dropdown,
              matchInputWidth && classes.match,
              dropdownClass
            ])}
          >
            {items.map(item => {
              return (
                <div
                  key={item?.props?.['select-key'] ?? item}
                  className={clsx(classes.item, itemClass)}
                  onClick={() => {
                    setSelectedItem(item);
                    if (mode === 'hover') setShow(false);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </span>
      {show && (
        <div className={classes.backdrop} onClick={() => setShow(false)}></div>
      )}
    </>
  );
};
