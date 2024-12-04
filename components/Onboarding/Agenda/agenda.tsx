import React, {useCallback, useState} from 'react';
import classes from './agenda.module.scss';
import {CheckIcon, CircleIcon, CloseIcon} from '@/ds/Icons';
import {Button} from '@/ds/Button';
import {ButtonVariants} from '@/ds/Button/button';
import {useDispatch, useSelector} from 'react-redux';
import {selectOnboardingInfo, selectUserInfo} from '@/store/selectors';
import {useRouter} from 'next/navigation';
import {setUserOnboardingStatus} from '@/store/reducers/userSlice';
import useAPI from '@/utils/common/useAPI';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

interface AgendaProps {
  status?: Array<any>;
}

interface DataPropertyInterface {
  name: string;
  type: string;
  status: boolean;
  route: string;
}

const DATA: DataPropertyInterface[] = [
  {
    name: 'Welcome',
    type: 'welcome',
    status: false,
    route: '/'
  },
  {
    name: 'Values',
    type: 'values',
    status: false,
    route: '/'
  },
  {
    name: 'The Forum',
    type: 'forum',
    status: false,
    route: '/forum'
  },
  {
    name: 'Functions',
    type: 'functions',
    route: '/function/all',
    status: false
  },
  {
    name: 'Objectives',
    type: 'objectives',
    route: '/members',
    status: false
  },
  {
    name: 'Partner Deals',
    type: 'deals',
    route: '/deals',
    status: false
  },
  {
    name: 'Profile',
    type: 'profile',
    route: '/settings?tab=profile',
    status: false
  },
  {
    name: 'Investors',
    type: 'investors',
    route: '/investors',
    status: false
  },
  {
    name: 'Addons',
    type: 'addon',
    route: '/raise',
    status: false
  },
  {
    name: 'Nomination',
    type: 'growTheNetwork',
    route: '/nominate',
    status: false
  },
  {
    name: 'Nomination',
    type: 'rewards',
    route: '/nominate',
    status: false
  }
];

export const Agenda: React.FC<AgendaProps> = () => {
  const [closeAgenda, setCloseAgenda] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const onboardingInfo = useSelector(selectOnboardingInfo());
  const isOnboardingCompleted = onboardingInfo?.status?.completed;
  const pendingAgenda: {name: string; route: string}[] = [];
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;
  const api = useAPI();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  DATA.forEach((d: DataPropertyInterface) => {
    d.status = onboardingInfo?.status?.[d.type];

    if (!onboardingInfo?.status?.[d.type]) {
      pendingAgenda.push({name: d.name, route: d.route});
    }
  });

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
  const buttonClickHandler = useCallback(() => {
    dispatch(setUserOnboardingStatus({type: 'aborted', value: false}));
    router.push(pendingAgenda[0].route);
    doPOSTAPICall('aborted', false);
  }, [pendingAgenda, userInfo]);

  const closeClickHandler = useCallback(() => {
    dispatch(setUserOnboardingStatus({type: 'aborted', value: true}));
    setCloseAgenda(true);
    doPOSTAPICall('aborted', true);
  }, [pendingAgenda, userInfo]);

  const doneClickHandler = useCallback(() => {
    dispatch(setUserOnboardingStatus({type: 'completed', value: true}));
    doPOSTAPICall('completed', true);
  }, [userInfo]);

  return (
    <>
      {['Admin', 'Charter', 'Member'].includes(userRole ?? '') &&
        !isOnboardingCompleted &&
        !closeAgenda &&
        !isMobile && (
          <div className={classes.agendaContainer}>
            <h3 className={classes.headerText}>Onboarding Agenda</h3>
            <div className={classes.cross} onClick={closeClickHandler}>
              <CloseIcon />
            </div>
            <div>
              {DATA.map(d => {
                return (
                  d.type !== 'rewards' && (
                    <div className={classes.items}>
                      <p className={classes.item}>{d.name}</p>
                      <p className={classes.item} key={d.name}>
                        {d.status &&
                          !(
                            d.type === 'growTheNetwork' &&
                            !DATA[DATA.length - 1].status
                          ) && <CheckIcon />}
                        {pendingAgenda[0]?.name === d.name && (
                          <CircleIcon size="xs" beat />
                        )}{' '}
                      </p>
                    </div>
                  )
                );
              })}
            </div>
            <Button
              variant={ButtonVariants.OutlinePrimary}
              size="sm"
              onClick={buttonClickHandler}
            >
              Return To Onboarding
            </Button>
            <br />
            <Button
              variant={ButtonVariants.OutlineSecondary}
              size="sm"
              onClick={doneClickHandler}
              className={classes.completeOnboarding}
            >
              Complete Onboarding
            </Button>
          </div>
        )}
    </>
  );
};
