import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import classes from './icons.module.scss';
import clsx from 'clsx';
interface AddToCalendarProps {
  count?: number | string;
}

export const AddToCalendarIcon: React.FC<AddToCalendarProps> = ({
  count,
  ...props
}: AddToCalendarProps) => {
  return (
    <>
      <FontAwesomeIcon
        icon={faCalendar}
        className={clsx(classes.icon, classes.addToCalendar)}
        // size="2xl"
        {...props}
      />
      {count !== undefined && <span>{count}</span>}
    </>
  );
};
