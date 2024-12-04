import AddToCalendarSvg from '@/public/svgIcons/calendar_ico.svg';
import classes from './icons.module.scss';
import Image from 'next/image';
interface CalendarPropsType {
  count?: number | string;
}

export const CalendarIcon: React.FC<CalendarPropsType> = ({
  count
}: CalendarPropsType) => {
  return (
    <>
      <Image
        src={AddToCalendarSvg}
        alt="add to calendar"
        className={classes.addToCalendar}
      />
      {count && <span>{count}</span>}
    </>
  );
};
