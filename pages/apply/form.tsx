import {InvitationForm} from '@/components/InvitationForm';
import {REQUEST_INVITATION_PAGE_TITLE} from '@/utils/common/constants';
import Head from 'next/head';

import styles from './apply.module.scss';

export default function InvitationFormPage() {
  return (
    <>
      <Head>
        <title>{REQUEST_INVITATION_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3887327,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
          }}
        />
      </Head>
      <main>
        <div className={styles.formContainer}>
          <InvitationForm />
        </div>
      </main>
    </>
  );
}
