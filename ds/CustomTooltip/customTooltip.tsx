import React from 'react';
import classes from './customTooltip.module.scss';
import clsx from 'clsx';

interface TooltipProps {
  position?: string;
  children: React.ReactNode;
}

export const CustomTooltip: React.FC<TooltipProps> = ({
  position = 'left',
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(classes['tooltipContainer'], classes[position])}
      {...props}
    >
      {children}
    </div>
  );
};
