import React from 'react';
import classes from '@/components/ChatPopup/popupStyles.module.scss';
import clsx from 'clsx';
import Image from 'next/image';

type OverlayPopupProps = {
  expanded: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type OverlayPopupHeaderProps = {
  expanded: boolean;
  togglePopup: () => void;
  userImg?: string;
  heading: string;
  subHeading?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type OverlayPopupComponent = React.FC<OverlayPopupProps> & {
  Header: React.FC<OverlayPopupHeaderProps>;
};

export const OverlayPopup: OverlayPopupComponent = ({
  children,
  className,
  expanded,
  ...props
}) => {
  return (
    <div
      className={clsx(className, classes.popup, expanded && classes.expanded)}
      {...props}
    >
      {children}
    </div>
  );
};

const OverlayPopupHeader: React.FC<OverlayPopupHeaderProps> = ({
  children,
  expanded,
  className,
  userImg,
  togglePopup,
  heading,
  subHeading,
  ...rest
}) => {
  return (
    <button
      className={clsx(className, classes.popupHeader)}
      onClick={togglePopup}
      {...rest}
    >
      {userImg && (
        <div className={classes.popupImg}>
          <Image src={userImg} alt="User Image" fill />
        </div>
      )}

      <div className={classes.popupHeaderInfo}>
        {heading && <div className={classes.heading}>{heading}</div>}
        {expanded && subHeading && (
          <div className={classes.subHeading}>{subHeading}</div>
        )}
      </div>

      <div className={classes.popupHeaderBtns}>{children}</div>
    </button>
  );
};

OverlayPopup.Header = OverlayPopupHeader;
