import {
  LIBRARY_DETAILS_PAGE_TTITLE,
  LIBRARY_ITEM_TYPES
} from '@/utils/common/constants';
import Head from 'next/head';
import useAuth from '@/hooks/useAuth';
import {LibraryItemPage} from '@/components/LibrayItemPage/libraryItemPage';
import {Spinner} from '@/ds/Spinner';
import {useRouter} from 'next/router';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import {fetchSecure} from '@/utils/common/helper';
import {useSelector} from 'react-redux';
import {selectLibraryItem} from '@/store/selectors';
import {LibraryItemHeader} from '@/components/Library/LibraryItemHeader/libraryItemHeader';

interface HelpItemPageProps {
  data: null | LibraryItem;
}

export default function FunctionDetailsPage({
  data
}: Readonly<HelpItemPageProps>) {
  useAuth();
  const router = useRouter();
  const updates = useSelector(
    selectLibraryItem(LIBRARY_ITEM_TYPES.HELP_CENTER, data?.id)
  );

  return (
    <>
      <Head>
        <title>{LIBRARY_DETAILS_PAGE_TTITLE}</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={`centerContainer w-100`}>
          {router.isFallback ? (
            <Spinner className="mt-5" />
          ) : (
            <>
              {data && (
                <LibraryItemHeader
                  data={data}
                  type={LIBRARY_ITEM_TYPES.HELP_CENTER}
                />
              )}
              <LibraryItemPage data={data?.id ? {...data, ...updates} : null} />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const response: any = await fetchSecure(
    `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/help-center`
  );

  const data = response.ok ? await response.json() : null;

  return {
    paths: data
      ? data.map((item: any) => ({
          params: {
            itemId: item.id.toString()
          }
        }))
      : [],
    fallback: true
  };
}

export const getStaticProps = async ({params}: {params: any}) => {
  const itemId = params.itemId;

  const props: any = {
    data: {}
  };

  const response = await fetchSecure(
    `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/help-center/${itemId}`
  );

  if (!response.ok) {
    return {
      redirect: {
        destination: '/404'
      }
    };
  }

  props.data = response.ok ? await response.json() : null;

  return {
    props
  };
};
