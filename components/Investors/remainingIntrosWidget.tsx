import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import classes from './remainingIntrosWidget.module.scss';
import useAPI from '@/utils/common/useAPI';
import {Spinner} from '@/ds/Spinner';
import {
  selectApiState,
  selectRemainingIntrosInfo,
  selectUserInfo
} from '@/store/selectors';
import clsx from 'clsx';
// import {Button, ButtonVariants} from '@/ds/Button';
// import Link from 'next/link';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {Tooltip} from '@/ds/Tooltip';

export const RemainingIntrosWidget: React.FC = () => {
  const api = useAPI();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const remainingIntroRequests = useSelector(selectRemainingIntrosInfo());
  const loading = useSelector(selectApiState('getIntroRequestsCount'));
  const userInfo = useSelector(selectUserInfo());

  useEffect(() => {
    const fetchRemainingIntroCount = async () => {
      await api('getIntroRequestsCount', {userId: userInfo?.id ?? ''});
    };

    if (!remainingIntroRequests && userInfo?.id) {
      fetchRemainingIntroCount();
    }
  }, [userInfo?.id]);

  return (
    <div className={clsx(classes.container, 'container-border')}>
      <div className={classes.info}>
        <div className={classes.label}>
          <span className={clsx(!isMobile && 'd-block')}>Remaining Intro </span>

          <span className="position-relative">
            <span>Requests</span>
            <div className={classes.icon}>
              <Tooltip
                popover={
                  <>
                    <div>
                      Monthly memberships can use 1 intro request per month.
                    </div>
                    <div className="mt-1">
                      Annual memberships can use 12 intro requests per year.
                    </div>
                  </>
                }
                mode={isMobile ? 'click' : 'hover'}
                fixedPosition={!isMobile}
              />
            </div>
          </span>
        </div>
        <div className={classes.value}>
          <div>
            {loading ? (
              <Spinner size="sm" className="fs-6" />
            ) : (
              remainingIntroRequests ?? '-'
            )}
          </div>
        </div>
      </div>
      {/* TODO: Uncommment after 'profile > activity' section is created */}
      {/* <div className="p-2">
        <Link href="/profile">
          <Button variant={ButtonVariants.BluePrimary} className={classes.btn}>
            Track Past Intros
          </Button>
        </Link>
      </div> */}
    </div>
  );
};
