import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';

export default function NotFound(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home Feed | Founders Network</title>
      </Head>

      <main className={`${styles.main} pageLayout`}>
        <h1>Page Not Found!!</h1>
      </main>
    </>
  );
}
