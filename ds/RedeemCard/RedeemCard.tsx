import React from 'react';
import classes from './redeem.module.scss';
import clsx from 'clsx';

interface RedeemCardProps {
  plan: string;
}

const RedeemCard: React.FC<RedeemCardProps> = ({plan}) => {
  return (
    <div className={clsx(classes.RedeemContainer)}>
      <i className={clsx(classes.RedeemIcon)} />
      <div className={clsx(classes.RedeemText)}>
        <span>
          <a href={`/raise?stage=${plan}`} className={clsx(classes.anchor)}>
            Upgrade
          </a>
        </span>{' '}
        to access more deals.
      </div>
    </div>
  );
};

export default RedeemCard;
