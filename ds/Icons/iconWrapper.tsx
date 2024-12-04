import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';

interface IconWrapperProps extends FontAwesomeIconProps {
  icon: IconProp;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  className,
  ...props
}) => {
  return <FontAwesomeIcon icon={icon} className={clsx(className)} {...props} />;
};
