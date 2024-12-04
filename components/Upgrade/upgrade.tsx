import classes from './upgrade.module.scss';
import {PAYMENT_PLAN} from '@/utils/common/constants';
import {UpgradeCard} from './UpgradeCard';
import clsx from 'clsx';

type PLAN_MAP_TYPE = {
  [plan in PAYMENT_PLAN]: number;
};

const PAY_PLAN_MAP: PLAN_MAP_TYPE = {
  [PAYMENT_PLAN.BOOTSTRAP]: 1,
  [PAYMENT_PLAN.ANGEL]: 2,
  [PAYMENT_PLAN.SERIES_A]: 3,
  [PAYMENT_PLAN.LIFETIME]: 4
};

export const Upgrade: React.FC<{
  paymentPlan: PAYMENT_PLAN;
  className?: string;
  expanded?: boolean;
}> = ({paymentPlan, className = '', expanded = true}) => {
  return (
    <>
      <div className={clsx([classes.upgrade, className])}>
        {Object.keys(PAY_PLAN_MAP).map(
          (plan: string) =>
            PAY_PLAN_MAP[paymentPlan] < PAY_PLAN_MAP[plan as PAYMENT_PLAN] && (
              <UpgradeCard
                key={plan}
                plan={plan as PAYMENT_PLAN}
                expanded={expanded}
              />
            )
        )}
      </div>
    </>
  );
};
