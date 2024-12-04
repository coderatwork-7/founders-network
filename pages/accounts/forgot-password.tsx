import {ForgotPassword} from '@/components/ForgotPassword';
import Head from 'next/head';
import {FORGOT_PASSWORD_PAGE_TITLE} from '@/utils/common/constants';

export default function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>{FORGOT_PASSWORD_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1" />
      </Head>
      <main>
        <ForgotPassword />
      </main>
    </>
  );
}
