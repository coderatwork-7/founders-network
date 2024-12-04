import React from 'react';
import Head from 'next/head';
import {LIBRARY_PAGE_TITLE} from '@/utils/common/constants';
import useAuth from '@/hooks/useAuth';
import {LibraryPage} from '@/components/LibraryPage';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import {fetchSecure} from '@/utils/common/helper';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

interface LibraryPageProps {
  libraryItems: null | LibraryItem[];
  helpItems: null | LibraryItem[];
}

export default function Library({
  libraryItems,
  helpItems
}: Readonly<LibraryPageProps>): JSX.Element {
  useAuth();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  return (
    <>
      <Head>
        <title>{LIBRARY_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={`centerContainer w-100`}>
          <LibraryPage libraryItems={libraryItems} helpItems={helpItems} />
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const props = {
    libraryItems: [],
    helpItems: []
  };

  const responses = await Promise.all([
    fetchSecure(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/library`
    ),
    fetchSecure(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/help-center`
    )
  ]);

  props.libraryItems = responses[0].ok ? await responses[0].json() : null;
  props.helpItems = responses[1].ok ? await responses[1].json() : null;

  return {
    props,
    revalidate: 24 * 60 * 60
  };
};
