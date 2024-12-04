import React from 'react';
import clsx from 'clsx';
import Image, {StaticImageData} from 'next/image';
import OutlookIcon from '@/public/svgIcons/microsoft_outlook_icon.svg';
import GCalIcon from '@/public/svgIcons/google_calendar_icon.svg';
import AppleCalIcon from '@/public/svgIcons/apple_calendar_icon.svg';
import classes from './calendarIcons.module.scss';
import {Spinner} from '../Spinner';

interface CalendarIconsProps {
  ical?: string;
  outlook?: string;
  google?: string;
  iconClass?: string;
  className?: string;
  loading?: boolean;
  onDownload?: (href: string) => void;
}

const CalendarType: React.FC<{
  icon: StaticImageData;
  label: string;
  href: string;
  iconClass: string;
  download?: boolean;
  onDownload?: (href: string) => void;
}> = ({icon, label, href, iconClass, download, onDownload}) => {
  const handleClick = () => {
    onDownload?.(href);
  };

  return download ? (
    <div
      onClick={handleClick}
      className="d-flex align-items-center flex-column"
    >
      <div className={clsx(classes.calendar, iconClass)}>
        <Image src={icon} alt={label} width={20} height={20} />
      </div>
      <label>{label}</label>
    </div>
  ) : (
    <a
      href={href}
      target="_blank"
      className="d-flex align-items-center flex-column"
    >
      <div className={clsx(classes.calendar, iconClass)}>
        <Image src={icon} alt={label} width={20} height={20} />
      </div>
      <label>{label}</label>
    </a>
  );
};

export const CalendarIcons: React.FC<CalendarIconsProps> = ({
  ical,
  outlook,
  google,
  iconClass = '',
  className = '',
  loading = false,
  onDownload
}) => {
  const icons = (
    <>
      {ical && (
        <CalendarType
          icon={AppleCalIcon}
          label="Ical"
          href={ical}
          iconClass={iconClass}
          download
          onDownload={onDownload}
        />
      )}
      {google && (
        <CalendarType
          icon={GCalIcon}
          label="Google"
          href={google}
          iconClass={iconClass}
        />
      )}
      {outlook && (
        <CalendarType
          icon={OutlookIcon}
          label="Outlook"
          href={outlook}
          iconClass={iconClass}
          download
          onDownload={onDownload}
        />
      )}
    </>
  );
  return (
    <div className={classes.container}>
      <div
        className={clsx(
          classes.subcalendar,
          'p-1',
          'd-flex',
          'gap-2',
          className
        )}
      >
        {loading ? <Spinner size="sm" className="mx-5 my-3" /> : icons}
      </div>
    </div>
  );
};
