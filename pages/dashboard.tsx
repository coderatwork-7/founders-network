import {Spinner} from '@/ds/Spinner/spinner';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import styles from '@/styles/Home.module.scss';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';

export default function Home(): JSX.Element {
  const router = useRouter();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;
  const rsvpURL = userInfo?.rsvpFunctionDetailsUrl;
  let redirectUrl = router.query.callbackUrl;

  useEffect(() => {
    if (userRole === ROLES.INVESTOR) {
      router.push(`/profile/${userInfo.profileId}`);
    } else if (userRole === ROLES.GUEST) {
      //outer.push(rsvpURL ? rsvpURL : '/404');
      router.push('/function/all');
    } else {
      router.push(
        // @ts-ignore
        !redirectUrl || new URL(redirectUrl).pathname === '/'
          ? '/home'
          : redirectUrl
      );
    }
  }, [userInfo]);

  return (
    <>
      <main className={`${styles.main} pageLayout`}>
        <div className={`centerContainer`}>
          <Spinner />
        </div>
      </main>
    </>
  );
}
