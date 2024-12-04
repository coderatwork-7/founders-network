import {
  faChevronLeft,
  faChevronRight,
  faCircle
} from '@fortawesome/free-solid-svg-icons';
import {MouseEventHandler, SyntheticEvent, useCallback} from 'react';
import RDatePicker, {ReactDatePickerCustomHeaderProps} from 'react-datepicker';
import {IconWrapper} from '../Icons';
import {getDate, isSameDay, format, isToday, isPast} from 'date-fns';
import classes from './datePicker.module.scss';
import clsx from 'clsx';
import useIsMobile from '@/utils/common/useIsMobile';

export interface DatePickerProps {
  selectedDate?: Date;
  onDateClick?: (date: Date, hasEvent?: boolean) => void;
  onDecreaseMonth?: (date: Date) => void;
  onIncreaseMonth?: (date: Date) => void;
  handleViewAllClick?: MouseEventHandler;
  events?: Array<string>;
  onChangeHandler?: (
    date: Date | null,
    event: SyntheticEvent<any, Event> | undefined
  ) => void;
  className?: string;
  children?: React.ReactNode;
}

export const DatePickerFacet: React.FC<DatePickerProps> = ({
  selectedDate,
  events,
  onDateClick,
  onDecreaseMonth,
  onIncreaseMonth,
  handleViewAllClick,
  onChangeHandler = () => {},
  className,
  children
}) => {
  const isMobile = useIsMobile();
  const CustomHeader = useCallback(
    ({
      date,
      decreaseMonth,
      increaseMonth,
      monthDate,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled
    }: ReactDatePickerCustomHeaderProps) => {
      const handleDecreaseMonth: MouseEventHandler<
        HTMLButtonElement
      > = event => {
        decreaseMonth();
        onDecreaseMonth?.(monthDate);
      };

      const handleIncreaseMonth: MouseEventHandler<
        HTMLButtonElement
      > = event => {
        increaseMonth();
        onIncreaseMonth?.(monthDate);
      };

      return (
        <div
          className={clsx(
            classes['header'],
            'pb-2',
            'd-flex',
            'justify-content-between',
            'align-items-center'
          )}
        >
          <div className={clsx(classes['month'], isMobile && 'ps-1')}>
            <span>{`${format(date, 'MMMM')} ${date.getFullYear()}`}</span>
          </div>
          <div>
            <button
              className={clsx(
                classes['header-button'],
                isMobile && classes['mobile'],
                isMobile ? 'me-4' : 'me-3'
              )}
              onClick={handleDecreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              {<IconWrapper icon={faChevronLeft} />}
            </button>

            <button
              className={clsx(
                classes['header-button'],
                isMobile && classes['mobile']
              )}
              onClick={handleIncreaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {<IconWrapper icon={faChevronRight} />}
            </button>
          </div>
        </div>
      );
    },
    [onDecreaseMonth, onIncreaseMonth, isMobile]
  );

  const renderDayContents = useCallback(
    (dayOfMonth: number, date: Date) => {
      const hasEvent = events?.some(eventDate =>
        isSameDay(new Date(eventDate), date)
      );

      return (
        <div
          className={clsx(
            classes['date-cell'],
            isPast(date) && !isToday(date) && classes['past'],
            isToday(date) && classes['today'],
            !hasEvent && 'react-datepicker__day--no-event'
          )}
          onClick={() => hasEvent && onDateClick?.(date)}
        >
          <span className={clsx(hasEvent && classes['event-dot'])}>
            {getDate(date)}
          </span>
        </div>
      );
    },
    [onDateClick, events]
  );

  const formatWeekDay = useCallback(
    (nameOfDay: any) => nameOfDay.substr(0, 1),
    []
  );

  return (
    <RDatePicker
      todayButton={
        <>
          <div
            onClick={selectedDate && handleViewAllClick}
            className={clsx(
              classes['today-btn'],
              isMobile && classes['mobile']
            )}
          >
            <IconWrapper icon={faCircle} />
          </div>
          <div className={classes['view-all']}>
            {selectedDate && (
              <a className="pe-auto" onClick={handleViewAllClick}>
                View All
              </a>
            )}
          </div>
        </>
      }
      formatWeekDay={formatWeekDay}
      selected={selectedDate}
      renderCustomHeader={CustomHeader}
      renderDayContents={renderDayContents}
      onChange={onChangeHandler}
      calendarClassName={clsx(
        classes['react-datepicker'],
        'w-100',
        'px-2',
        'container-border',
        className
      )}
      inline
    >
      {children}
    </RDatePicker>
  );
};
