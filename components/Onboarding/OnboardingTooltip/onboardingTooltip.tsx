import React, {MouseEventHandler, useCallback} from 'react';
import classes from './onboardingTooltip.module.scss';
import {CustomTooltip} from '@/ds/CustomTooltip';
import {OnboardingContent} from '../Content';
import {usePathname, useRouter} from 'next/navigation';
import {selectOnboardingInfo, selectUserInfo} from '@/store/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {setUserOnboardingStatus} from '@/store/reducers/userSlice';
import useAPI from '@/utils/common/useAPI';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

interface DataPropertyInterface {
  nextroute?: string;
  header?: string;
  content?: string;
  status?: boolean;
}

interface DataInterface {
  forum: DataPropertyInterface;
  functions: DataPropertyInterface;
  objectives: DataPropertyInterface;
  deals: DataPropertyInterface;
  profile: DataPropertyInterface;
  investors: DataPropertyInterface;
  addon: DataPropertyInterface;
  growTheNetwork: DataPropertyInterface;
  rewards: DataPropertyInterface;
}

const TYPES = [
  'forum',
  'functions',
  'objectives',
  'deals',
  'profile',
  'investors',
  'addon',
  'growTheNetwork',
  'rewards'
];

const DATA: DataInterface = {
  forum: {
    nextroute: '/function/all',
    header: 'The Forum',
    content: '',
    status: false
  },
  functions: {
    nextroute: '/members',
    header: 'Functions',
    content: '',
    status: false
  },
  objectives: {
    nextroute: '/deals',
    header: 'Objectives',
    content: '',
    status: false
  },
  deals: {
    nextroute: '/settings?tab=profile',
    header: 'Partner Deals',
    content: '',
    status: false
  },
  profile: {
    nextroute: '/investors',
    header: 'Complete Your Profile',
    content: '',
    status: false
  },
  investors: {
    nextroute: '/raise',
    header: '[fn]Investors',
    content: '',
    status: false
  },
  addon: {
    nextroute: 'nominate',
    header: 'Addons',
    content: '',
    status: false
  },
  growTheNetwork: {
    nextroute: 'nominate',
    header: 'Grow The Network',
    content: '',
    status: false
  },
  rewards: {
    nextroute: '',
    header: 'Nomination Rewards',
    content: '',
    status: false
  }
};

interface OnboardingTooltipProps {
  type?: string;
  position: string;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  type = 'forum',
  position
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const onboardingInfo = useSelector(selectOnboardingInfo());
  const isOnboardingCompleted = onboardingInfo?.status?.completed;
  const isAborted = onboardingInfo?.status?.aborted;
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;
  const api = useAPI();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  TYPES.forEach((type: string) => {
    // @ts-ignore
    DATA[type] = {
      // @ts-ignore
      ...DATA[type],
      content: onboardingInfo?.messages?.[type],
      status: onboardingInfo?.status?.[type]
    };
  });

  // @ts-ignore
  const component = DATA[type];

  const doPOSTAPICall = (type: string, value: boolean) => {
    api(
      'updateUserOnboardingStatus',
      {
        userId: userInfo?.id
      },
      {
        method: 'PUT',
        data: {
          status: {
            [type]: value
          }
        }
      }
    );
  };

  const closeClickHandler: MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      dispatch(setUserOnboardingStatus({type: 'aborted', value: true}));
      doPOSTAPICall('aborted', true);
    }, [userInfo]);

  const nextClickHandler: MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      component?.nextroute && router.push(component?.nextroute);
      dispatch(setUserOnboardingStatus({type: type, value: true}));
      doPOSTAPICall(type, true);
    }, [userInfo]);

  const doneClickHandler: MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      dispatch(setUserOnboardingStatus({type: 'completed', value: true}));
      doPOSTAPICall('rewards', true);
      doPOSTAPICall('completed', true);
    }, [userInfo]);

  return (
    <>
      {['Admin', 'Charter', 'Member'].includes(userRole ?? '') &&
        !isOnboardingCompleted &&
        !isMobile && (
          <div className={classes.onboardingTooltipContainer}>
            {pathname.indexOf('home') === -1 &&
              !isAborted &&
              !component?.status &&
              !(type === 'rewards' && !DATA.growTheNetwork.status) && (
                <CustomTooltip position={position}>
                  <OnboardingContent
                    header={component?.header}
                    content={component?.content}
                    type={type}
                    closeClickHandler={closeClickHandler}
                    nextClickHandler={component.nextroute && nextClickHandler}
                    doneClickHandler={doneClickHandler}
                  />
                </CustomTooltip>
              )}
          </div>
        )}
    </>
  );
};
