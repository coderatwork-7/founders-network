import {LifetimeMembershipBanner} from './LifetimeMembershipBanner';

import classes from './upgradepage.module.scss';

import {MembershipLevel} from './MembershipLevel';

import {useSearchParams} from 'next/navigation';

export const UpgradePage = () => {
  const searchParams = useSearchParams();

  const plan = searchParams.get('stage');

  if (!plan) return null;
  return (
    <div>
      {plan !== 'lifetime' && (
        <div className={classes['lifetimeBanner']}>
          <LifetimeMembershipBanner />
        </div>
      )}

      <MembershipLevel plan={plan} />
    </div>
  );
};
