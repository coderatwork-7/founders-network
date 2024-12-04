import React from 'react';
import classes from './badge.module.scss';
import clsx from 'clsx';

interface BadgeProps {
  icon: any;
  count?: number;
  size?: string;
  [key: string]: any;
}

export const Badge: React.FC<BadgeProps> = ({
  icon,
  count,
  size = 'md',
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx([classes.container, classes[size], props?.className])}
    >
      {+(count ?? 0) > 0 && <span className={classes.count}>{count}</span>}
      {icon}
    </div>
  );
};
