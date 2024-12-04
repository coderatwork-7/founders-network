import {FUNCTIONS_DETAILS_PAGE_TTITLE} from '@/utils/common/constants';
import Head from 'next/head';
import {FunctionDetails} from '@/components/Function/FunctionDetails';
import useAuth from '@/hooks/useAuth';

import {useFunctionQuery} from '@/genericApi/foundersNetwork/queries';

import {useRouter} from 'next/router';

export default function FunctionDetailsPage() {
  useAuth();

  const router = useRouter();

  const {functionId} = router.query;

  const {data} = useFunctionQuery(functionId as string);

  return (
    <>
      <Head>
        <title>{FUNCTIONS_DETAILS_PAGE_TTITLE}</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={`centerContainer`}>
          <FunctionDetails functionStaticInfo={data} />
        </div>
      </main>
    </>
  );
}
