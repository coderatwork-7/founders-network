import clsx from 'clsx';
import classes from './radios.module.scss';
import {forwardRef, useImperativeHandle, useState} from 'react';

interface RadiosProps {
  labels: string[];
  selectedIndex: number;
  radioOnClick?: Function;
  containerClassName?: string;
}
export const Radios = forwardRef<{selectedIndex: number}, RadiosProps>(
  ({labels, selectedIndex, radioOnClick, containerClassName}, ref) => {
    const [selected, setSelected] = useState(selectedIndex);

    useImperativeHandle(ref, () => ({
      selectedIndex: selected,
      selectedValue: labels[selected]
    }));

    return (
      <div
        className={clsx(
          containerClassName ?? 'd-flex align-items-center gap-3'
        )}
      >
        {labels.map((label, index) => (
          <div
            className={clsx(
              'd-flex align-items-center gap-1 cursorPointer',
              classes.smallText
            )}
            onClick={() => {
              setSelected(index);
              radioOnClick?.(index);
            }}
            key={index}
          >
            <div
              className={
                selected === index ? classes.selected : classes.unSelected
              }
            ></div>
            {label}
            {/* <input type="radio" className="d-none" checked={selected === index} /> */}
          </div>
        ))}
      </div>
    );
  }
);
