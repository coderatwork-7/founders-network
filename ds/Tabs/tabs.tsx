import clsx from 'clsx';
import classes from './tabs.module.scss';
import {useState} from 'react';
interface TabsProps {
  labels: string[];
  selectedIndex: number;
  setSelected: (selectedIndex: number) => void;
  tabClass?: string;
  containerClass?: string;
}
export function Tabs({
  labels,
  selectedIndex,
  setSelected,
  tabClass,
  containerClass
}: TabsProps) {
  const [tabIndex, setTabIndex] = useState(selectedIndex);
  return (
    <div
      className={clsx(
        classes.container,
        'd-flex align-items-center justify-content-evenly',
        containerClass
      )}
    >
      {labels.map((label, index) => (
        <div
          key={`${label}_${index}`}
          className={clsx(
            classes.label,
            index === tabIndex && classes.selected,
            'cursorPointer w-100',
            tabClass
          )}
          onClick={() => {
            setSelected(index);
            setTabIndex(index);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
