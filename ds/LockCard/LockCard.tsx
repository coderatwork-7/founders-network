import React from 'react';
import classes from './lock.module.scss';
import clsx from 'clsx';

interface LockCardProps {
  // Add any additional props you may need
}

const LockCard: React.FC<LockCardProps> = () => {
  return (
    <div className={clsx(classes.lockContainer)}>
      <i className={clsx(classes.lockIcon)} />
      <div className={clsx(classes.lockText)}>
        Upgrade to access more deals.{' '}
        <span>
          <a href="/raise" className={clsx(classes.anchor)}>
            Learn more.
          </a>
        </span>
      </div>
    </div>
  );
};

export default LockCard;
