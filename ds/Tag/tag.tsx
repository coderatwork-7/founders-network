import clsx from 'clsx';
import React, {ReactNode, useState} from 'react';
import classes from './tag.module.scss';

interface TagProps {
  defaultSelected?: boolean;
  className?: string;
  selectedClassName?: string;
  selectableClassName?: string;
  onClick?: (selected: boolean, val: ReactNode) => void;
  children?: ReactNode;
  selectable?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  defaultSelected = false,
  className = '',
  onClick = () => {},
  children,
  selectedClassName = '',
  selectableClassName = '',
  selectable = false
}) => {
  const [selected, setSelected] = useState<boolean>(defaultSelected);

  const handleSelect = () => {
    setSelected(v => {
      onClick(!v, children);
      return !v;
    });
  };

  return (
    <span
      onClick={selectable ? handleSelect : undefined}
      className={clsx([
        classes.badge,
        className,
        selectable && [classes.selectable, selectableClassName],
        selected && [classes.selected, selectedClassName],
        'badge'
      ])}
    >
      {children}
    </span>
  );
};
