import {
  LIBRARY_ITEM_TYPES,
  LIBRARY_DETAILS_PAGE_TTITLE
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
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

interface LibraryItemPageProps {
  data: null | LibraryItem;
  mentionedPosts: null | any[];
}

export default function FunctionDetailsPage({
  data,
  mentionedPosts
}: Readonly<LibraryItemPageProps>) {
  useAuth();
  const router = useRouter();
  const updates = useSelector(
    selectLibraryItem(LIBRARY_ITEM_TYPES.LIBRARY, data?.id)
  );
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

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
                  type={LIBRARY_ITEM_TYPES.LIBRARY}
                />
              )}
              <LibraryItemPage
                data={{...data, ...updates}}
                mentionedPosts={mentionedPosts}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const response: any = await fetchSecure(
    `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/library`
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
    data: {},
    mentionedPosts: []
  };

  const responses = await Promise.all([
    fetchSecure(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/library/${itemId}`
    ),
    fetchSecure(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/library/${itemId}/mention-posts`
    )
  ]);

  if (!responses[0].ok) {
    return {
      redirect: {
        destination: '/404'
      }
    };
  }

  props.data = responses[0].ok ? await responses[0].json() : null;
  props.mentionedPosts = responses[1].ok ? await responses[1].json() : null;

  return {
    props
  };
};
