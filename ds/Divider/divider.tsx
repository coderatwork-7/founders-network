import React from 'react';
import classes from './divider.module.scss';
import clsx from 'clsx';

export const Divider: React.FC<{className?: string}> = ({className}) => {
  return <div className={clsx(classes.divider, className)}></div>;
};
