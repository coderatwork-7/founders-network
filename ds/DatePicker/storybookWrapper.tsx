import React, {useCallback, useState} from 'react';
import {DatePickerFacet} from './datePickerFacet';
import 'react-datepicker/dist/react-datepicker.css';
import './datePicker.css';

export const StorybookWrapper: React.FC<{events: any; selectedDate?: Date}> = ({
  events,
  selectedDate
}) => {
  const [selectedValue, setSelectedValue] = useState<Date | undefined>(
    selectedDate
  );

  const handleChange = useCallback((value: Date, hasEvent?: boolean) => {
    hasEvent && setSelectedValue(value);
  }, []);

  const handleViewAllClick = useCallback((event: any) => {
    event.preventDefault();
    setSelectedValue(undefined);
  }, []);

  return (
    <DatePickerFacet
      selectedDate={selectedValue}
      onDateClick={handleChange}
      events={events}
      handleViewAllClick={handleViewAllClick}
    />
  );
};
