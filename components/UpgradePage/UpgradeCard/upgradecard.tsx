import React from 'react';
import Card from '@/ds/Card/card';
import classes from './upgradecard.module.scss';
import clsx from 'clsx';

interface UpgradeCardPropsTypes {
  children: any;
  className?: string;
  borderClassName?: string;
  defaultBorder?: boolean;
}

export const UpgradeCard = ({
  children,
  className,
  borderClassName,
  defaultBorder
}: UpgradeCardPropsTypes) => {
  return (
    <Card className={clsx(className)}>
      {(borderClassName || defaultBorder) && (
        <div
          className={clsx(
            classes['cardTopBorderStyles'],
            'borderStyles',
            borderClassName
          )}
        ></div>
      )}
      <div className={classes['contentContainer']}>{children}</div>
    </Card>
  );
};
