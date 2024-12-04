import {DatePickerFacet as RDatePickerFacet} from '@/ds/DatePicker';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {format} from 'date-fns';
import styles from './datePicker.module.scss';
import useIsMobile from '@/utils/common/useIsMobile';
import {Button, ButtonVariants} from '@/ds/Button';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {
  selectAllCalendarEvents,
  selectCalendarMonthsLoaded,
  selectUserInfo
} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {getStartEndDateOfMonth} from './helper';
import {FunctionPageFacetsContext} from '../ContextProviders/FunctionPageFacetsContext';

export const DatePicker: React.FC<{}> = () => {
  const {updateFacetValue, selectedFacetValues, setApplyFacets} = useContext(
    FunctionPageFacetsContext
  );

  const api = useAPI();

  const isMobile = useIsMobile();
  const userInfo = useSelector(selectUserInfo());

  const [selectedValue, setSelectedValue] = useState<Date | undefined>();
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const events: Array<string> = useSelector(selectAllCalendarEvents());
  const allEventsMonth: Array<string> = useSelector(
    selectCalendarMonthsLoaded()
  );

  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedAllEventsMonth = useMemo(() => {
    return allEventsMonth;
  }, [allEventsMonth]);

  const fetchEventsDate = useCallback(
    async (fromDate: Date, toDate: Date, month?: Array<string>) => {
      await api('getCalendarEvents', {
        isReduxSkipped: false,
        userId: userInfo?.id,
        from: format(fromDate, 'yyyy-MM-dd'),
        to: format(toDate, 'yyyy-MM-dd'),
        month: month
      });
    },
    [memoizedAllEventsMonth, userInfo, api]
  );

  const handleChange = (value: Date) => {
    const facetValueKey = format(value, 'yyyy-MM-dd');
    updateFacetValue(
      {
        start_date: {
          [facetValueKey]: {
            facetValueKey,
            facetValueName: facetValueKey
          }
        }
      },
      false
    );
    setApplyFacets?.(true);
  };

  const handleViewAllClick = useCallback((event: any) => {
    event.preventDefault();
    updateFacetValue({start_date: {}}, false);
    setApplyFacets?.(true);
  }, []);

  useEffect(() => {
    if (userInfo?.id && !events.length) {
      const {startOfMonth, endOfMonth, months} = getStartEndDateOfMonth({
        date: new Date(),
        offset: 1
      });
      setShowSpinner(true);
      fetchEventsDate(startOfMonth, endOfMonth, months).then(() =>
        setShowSpinner(false)
      );
    }
  }, [userInfo?.id]);

  useEffect(() => {
    if (
      selectedFacetValues?.start_date &&
      Object.values(selectedFacetValues.start_date)[0]
    )
      setSelectedValue(
        new Date(Object.keys(selectedFacetValues.start_date)[0])
      );
    else setSelectedValue(undefined);
  }, [selectedFacetValues?.start_date]);

  const handleDecreaseMonth = useCallback(
    async (date: Date) => {
      const {startOfMonth, endOfMonth, months} = getStartEndDateOfMonth({
        date,
        flag: true
      });
      if (!memoizedAllEventsMonth.includes(months[0])) {
        setShowSpinner(true);
        try {
          await fetchEventsDate(startOfMonth, endOfMonth, months);
        } finally {
          setShowSpinner(false);
        }
      }
    },
    [memoizedAllEventsMonth, getStartEndDateOfMonth, fetchEventsDate]
  );

  const handleIncreaseMonth = useCallback(
    async (date: Date) => {
      const {startOfMonth, endOfMonth, months} = getStartEndDateOfMonth({date});
      if (!memoizedAllEventsMonth.includes(months[0])) {
        setShowSpinner(true);
        try {
          await fetchEventsDate(startOfMonth, endOfMonth, months);
        } finally {
          setShowSpinner(false);
        }
      }
    },
    [memoizedAllEventsMonth, getStartEndDateOfMonth, fetchEventsDate]
  );

  const renderCalendar = () => (
    <>
      <RDatePickerFacet
        selectedDate={selectedValue}
        onDateClick={handleChange}
        events={memoizedEvents}
        handleViewAllClick={handleViewAllClick}
        onDecreaseMonth={handleDecreaseMonth}
        onIncreaseMonth={handleIncreaseMonth}
      >
        {showSpinner && (
          <div
            className={clsx(
              styles['overlay'],
              'position-absolute',
              'w-100',
              'h-100',
              'd-flex',
              'justify-content-center',
              'align-items-center'
            )}
          >
            <Spinner size="sm" />
          </div>
        )}
      </RDatePickerFacet>
    </>
  );

  const handleShowCalendar = useCallback(() => {
    setShowCalendar(prevState => !prevState);
  }, []);

  return (
    <div>
      {isMobile ? (
        <>
          {showCalendar && renderCalendar()}
          <Button
            variant={ButtonVariants.Primary}
            onClick={handleShowCalendar}
            className="mt-3"
          >
            {showCalendar ? 'HIDE CALENDAR' : 'SHOW CALENDAR'}
          </Button>
        </>
      ) : (
        renderCalendar()
      )}
    </div>
  );
};
