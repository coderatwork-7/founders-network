import React from 'react';
import {EnvelopIcon} from '@/ds/Icons';
import classes from './messages.module.scss';

export const Messages = () => {
  return (
    <div className={classes.messageContainer}>
      <EnvelopIcon />
    </div>
  );
};
