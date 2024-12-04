import React from 'react';
import Head from 'next/head';
import {Addendum} from '@/components/AddendumPage/addendum';

export default function NotFound(): JSX.Element {
  return (
    <>
      <Head>
        <title>404 | Founders Network</title>
      </Head>

      <main className={`pageLayout`}>
        <div className={`centerContainer`}>
          <Addendum />
        </div>
      </main>
    </>
  );
}
