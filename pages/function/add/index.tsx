import React from 'react';
import Head from 'next/head';
import useAuth from '@/hooks/useAuth';
import {FunctionEditPage} from '@/components/FunctionEditPage';

export default function Library(): JSX.Element {
  useAuth();

  return (
    <>
      <Head>
        <title>Add Function | Founders Network</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={`centerContainer w-100`}>
          <FunctionEditPage />
        </div>
      </main>
    </>
  );
}
