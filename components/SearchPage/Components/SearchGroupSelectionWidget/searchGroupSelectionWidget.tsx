import clsx from 'clsx';
import classes from './searchGroupSelectionWidget.module.scss';
import {capitalize, handleSpecificScroll} from '@/utils/common/helper';

interface SearchGroupSelectionWidgetProps {
  searchGroups: string[];
  activeSearchGroup: string;
  setActiveSearchGroup: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchGroupSelectionWidget({
  searchGroups,
  activeSearchGroup,
  setActiveSearchGroup
}: SearchGroupSelectionWidgetProps) {
  const handleActivateGroup = (id: string) => () => {
    setActiveSearchGroup(id);
    handleSpecificScroll({id, behavior: 'instant' as ScrollBehavior});
  };

  return (
    <div className={clsx(classes.container, 'w-100')}>
      {searchGroups.map(group => (
        <div
          key={group}
          onClick={handleActivateGroup(group)}
          className={clsx(
            group === activeSearchGroup && classes.active,
            classes.groupLabel,
            classes[group]
          )}
        >
          {capitalize(group)}
        </div>
      ))}
    </div>
  );
}
