import {ResetPassword} from '@/components/ResetPassword';
import Head from 'next/head';
import {RESET_PASSWORD_PAGE_TITLE} from '@/utils/common/constants';

export default function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>{RESET_PASSWORD_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1" />
      </Head>
      <main>
        <ResetPassword />
      </main>
    </>
  );
}
