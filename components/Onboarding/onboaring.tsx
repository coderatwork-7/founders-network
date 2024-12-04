import React, {useCallback, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {selectOnboardingInfo, selectUserInfo} from '@/store/selectors';
import classes from './onboarding.module.scss';
import {WelcomeUser} from './WelcomeUser';
import {OurVision} from './OurVision';
import {OurValues} from './OurValues';
import {setUserOnboardingStatus} from '@/store/reducers/userSlice';
import useAPI from '@/utils/common/useAPI';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

export const Onboarding: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const onboardingInfo = useSelector(selectOnboardingInfo());
  const userInfo = useSelector(selectUserInfo());
  const [startOnboarding, setStartOnboarding] = useState(false);
  const status = onboardingInfo?.status;
  const userRole = userInfo?.role;
  const api = useAPI();
  const isMobile = Breakpoint.mobile === useBreakpoint();

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
            [type]: true
          }
        }
      }
    );
  };

  const buttonClickHandler = useCallback((type: string) => {
    dispatch(setUserOnboardingStatus({type: type, value: true}));
    doPOSTAPICall(type, true);
    return '';
  }, []);

  const valuesClickHandler = useCallback((type: string) => {
    setStartOnboarding(true);
    dispatch(setUserOnboardingStatus({type: type, value: true}));
    doPOSTAPICall(type, true);
    router.push('/forum');
  }, []);
  return (
    <>
      {!startOnboarding &&
        ['Admin', 'Charter', 'Member'].includes(userRole ?? '') &&
        !isMobile &&
        (!status?.welcome || !status?.vision || !status?.values) && (
          <div className={classes.onboardingContainer}>
            <div className={classes.onboardingOverlay}>
              {!status?.welcome && (
                <WelcomeUser
                  name={userInfo && userInfo.name}
                  buttonClickHandler={buttonClickHandler}
                />
              )}
              {status?.welcome && !status?.vision && (
                <OurVision buttonClickHandler={buttonClickHandler} />
              )}
              {status?.welcome && status?.vision && !status?.values && (
                <OurValues buttonClickHandler={valuesClickHandler} />
              )}
            </div>
          </div>
        )}
    </>
  );
};
