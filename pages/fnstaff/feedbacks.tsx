import {FeedbacksPage} from '@/components/Feedbacks/components/FeedbacksPage';
import useAuth from '@/hooks/useAuth';
import Head from 'next/head';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Feedbacks(): JSX.Element {
  useAuth();

  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  return (
    <>
      <Head>
        <title>Site Feedbacks | Founders Network</title>
        <meta charSet="utf-8" />
      </Head>
      <main className="fullWidthPage">
        <FeedbacksPage />
      </main>
    </>
  );
}
