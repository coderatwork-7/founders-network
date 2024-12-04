import React from 'react';
import {IconWrapper} from '../Icons';
import {faHandshake, faMessage} from '@fortawesome/free-regular-svg-icons';

import classes from './introMessageButton.module.scss';
import clsx from 'clsx';

interface IIntroMessageButtonProps {
  handleIntroClick?: React.MouseEventHandler<HTMLAnchorElement>;
  handleMessageClick?: React.MouseEventHandler<HTMLAnchorElement>;
  isCompatible?: boolean;
}

export const IntroMessageButton: React.FC<IIntroMessageButtonProps> = ({
  handleIntroClick,
  handleMessageClick,
  isCompatible
}) => {
  const singleIconStyle = !isCompatible ? {borderRadius: '5px'} : undefined;

  return (
    <div className={clsx(classes.wrapper, 'text-center')}>
      {handleIntroClick && isCompatible && (
        <a
          title="Request Intro"
          className={clsx([
            classes.info,
            !handleMessageClick && classes.single
          ])}
          onClick={handleIntroClick}
        >
          <IconWrapper icon={faHandshake}></IconWrapper>
        </a>
      )}
      {handleMessageClick && (
        <a
          title="Send Message"
          className={clsx([
            classes.message,
            !handleIntroClick && classes.single
          ])}
          onClick={handleMessageClick}
          style={singleIconStyle}
        >
          <IconWrapper icon={faMessage}></IconWrapper>
        </a>
      )}
    </div>
  );
};
