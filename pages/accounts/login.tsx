import {LoginForm} from '@/components/Login';
import Head from 'next/head';
import {HOME_PAGE_TITLE} from '@/utils/common/constants';

export default function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>{HOME_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1" />
      </Head>
      <main>
        <LoginForm />
      </main>
    </>
  );
}
