import React from 'react';
import Head from 'next/head';
import useAuth from '@/hooks/useAuth';
import {useRouter} from 'next/router';
import {FunctionEditPage} from '@/components/FunctionEditPage';

export default function Library(): JSX.Element {
  useAuth();
  const {functionId} = useRouter().query;

  return (
    <>
      <Head>
        <title>Edit Function | Founders Network</title>
        <meta charSet="utf-8" />
      </Head>
      <main className="pageLayout">
        <div className="centerContainer w-100">
          <FunctionEditPage id={functionId as string} />
        </div>
      </main>
    </>
  );
}
