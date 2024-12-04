import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import classes from './addToCalendar.module.scss';
import {Popover, PopoverPlacement} from '@/ds/Popover/popover';
import {CalendarIcons} from '@/ds/CalendarIcons';
import {AddToCalendarIcon} from '@/ds/Icons';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectFunctionCalendarLinks, selectUserInfo} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';

interface AddToCalendarProps {
  functionId: string;
  popoverPlacement?: PopoverPlacement;
  showPopover?: boolean;
  className?: string;
  iconClass?: string;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({
  functionId,
  popoverPlacement = 'bottom-start',
  showPopover = false,
  className,
  iconClass
}) => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const userInfo = useSelector(selectUserInfo());
  const api = useAPI();
  const links = useSelector(selectFunctionCalendarLinks(functionId));
  const {ical, google, outlook} = links ?? {};

  const fetchCalendarLinks = () => {
    void (async () => {
      setLoading(true);
      await api('getFunctionCalendarLnks', {
        userId: userInfo?.id,
        functionId
      });
      setLoading(false);
    })();
  };

  const handleDownload = (href: string) => {
    setDownloading(true);
    api('downloadCalendar', {href}, {responseType: 'blob'})
      .then(() => setDownloading(false))
      .catch(() => setDownloading(false));
  };

  useEffect(() => {
    if (!links && !showPopover) fetchCalendarLinks();
  }, []);

  const PopoverContent = (
    <CalendarIcons
      ical={ical}
      google={google}
      outlook={outlook}
      className={className}
      iconClass={iconClass}
      loading={loading}
      onDownload={handleDownload}
    />
  );
  if (!showPopover) return PopoverContent;
  return (
    <div
      onClick={() => {
        if (!links?.ical) fetchCalendarLinks();
      }}
    >
      <Popover
        mode="click"
        placement={popoverPlacement}
        popover={PopoverContent}
        hideOnBlur
        closeOnClick
      >
        <div className={clsx([classes.calendar, 'newDesignBorder p-2'])}>
          {downloading ? <Spinner size="sm" /> : <AddToCalendarIcon />}
        </div>
      </Popover>
    </div>
  );
};
