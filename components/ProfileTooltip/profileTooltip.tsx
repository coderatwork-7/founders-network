import React, {JSXElementConstructor, ReactElement} from 'react';
import {Popover} from '../../ds/Popover';
import {PopoverCard} from './components/popoverCard';
import classes from './profileTooltip.module.scss';
import {PopoverProps} from '../../ds/Popover/popover';

interface ProfileData {
  id: number | string;
}

interface ProfileTooltipProps extends PopoverProps {
  profile: ProfileData;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

export const ProfileTooltip: React.FC<ProfileTooltipProps> = ({
  profile,
  children,
  ...props
}) => {
  return (
    <Popover
      mode="hover"
      placement="auto"
      popoverClass={classes.popover}
      popover={<PopoverCard {...profile} />}
      {...props}
      closeOnClick
    >
      {children}
    </Popover>
  );
};
