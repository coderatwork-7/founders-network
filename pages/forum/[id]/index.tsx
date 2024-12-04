import React from 'react';
import Head from 'next/head';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import useIsMobile from '@/utils/common/useIsMobile';
import classes from './index.module.scss';
import {ForumDetails} from '@/components/Forum/ForumDetails';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';
import {fetchSecure} from '@/utils/common/helper';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Functions(forumDetail: any): JSX.Element {
  useAuth();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  const isMobile = useIsMobile();
  return (
    <>
      <Head>
        <title>Forums | Founders Network</title>
      </Head>
      <div className={classes.page}>
        <div className={clsx('pageLayout bg-white', isMobile && 'top-0')}>
          <div
            className={`leftContainer ${
              !isMobile ? 'leftContainerFixedPostion' : ''
            }`}
          >
            {!isMobile && <NominationWidget />}
          </div>
          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            <ForumDetails forumDetail={forumDetail.forumDetail} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

export const getStaticProps = async ({params}: {params: any}) => {
  const forumId = params.id;
  const response: any = await fetchSecure(
    `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/feeds/forums/${forumId}`
  );
  if (response.status !== 200) {
    return {
      redirect: {destination: '/404'}
    };
  }
  const data = await response.json();
  return {
    props: {
      forumDetail: {...data}
    }
  };
};
