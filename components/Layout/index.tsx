import {Navbar} from '@/components/Navbar';
import {useSession} from 'next-auth/react';
import {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '@/store/reducers/userSlice';
import {ScrollButton} from '@/ds/ScrollButton';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {queryClient} from '@/pages/_app';
import useAPI from '@/utils/common/useAPI';
import {
  CONST_DEALS,
  CONST_FORUMS,
  CONST_FUNCTIONS,
  CONST_GROUPS,
  CONST_INVESTORS,
  CONST_INVESTOR_LOGIN,
  CONST_MEMBERS,
  CONST_OPPORTUNITIES,
  CONST_PARTNERS
} from '@/utils/common/constants';
import {usePathname} from 'next/navigation';
import {isQueryObjectEmpty} from '@/utils/common/helper';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {FeedbackBanner} from '../FeedbackBanner/feedbackBanner';
import useAuth from '@/hooks/useAuth';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const listingPageToPathnameMap = {
  '/forum': CONST_FORUMS,
  '/function/all': CONST_FUNCTIONS,
  '/members': CONST_MEMBERS,
  '/group/all': CONST_GROUPS,
  '/partners': CONST_PARTNERS,
  '/deals': CONST_DEALS
};
export const listingPageToApiMap = {
  [CONST_FORUMS]: 'getForumPosts',
  [CONST_FUNCTIONS]: 'getFunctionPageFeeds',
  [CONST_MEMBERS]: 'getMembersPageFeeds',
  [CONST_GROUPS]: 'getGroupsPageFeeds',
  [CONST_PARTNERS]: 'getPartnersPageFeeds',
  [CONST_DEALS]: 'getDeals'
};
type lpp = keyof typeof listingPageToPathnameMap;
type lpa = keyof typeof listingPageToApiMap;

export const PathnamesFacets = {
  '/forum': CONST_FORUMS,
  '/function/all': CONST_FUNCTIONS,
  '/members': CONST_MEMBERS,
  '/group/all': CONST_GROUPS,
  '/partners': CONST_PARTNERS,
  '/deals': CONST_DEALS,
  '/nominate': false,
  '/investors': CONST_INVESTORS,
  '/home': 'all-updates',
  '/': 'all-updates'
};
export default function Layout({children, cachePreloaded}: any) {
  const {data: session} = useSession();
  const [initializeEditor, setInitializeEditor] = useState(false);
  const makeApiCall = useAPI();
  const pathname = usePathname();
  const dispatch = useDispatch();
  useAuth();

  useEffect(() => {
    setInitializeEditor(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (initializeEditor) setInitializeEditor(false);
  }, [initializeEditor]);

  useEffect(() => {
    if (session) {
      const {
        iat: _iat,
        exp: _exp,
        jti: _jti,
        tokens: _tokens,
        ...userInfo
      } = session.user as any;
      dispatch(setUserInfo(userInfo));
    }
  }, [session]);

  useIsomorphicLayoutEffect(() => {
    if (session?.user && pathname && !cachePreloaded.current) {
      if (
        pathname === '/accounts/login' ||
        pathname === '/dashboard' ||
        pathname === '/apply/form'
      )
        return;
      const userId = session?.user?.id;
      const makeQueryKey = (pageName: string) => [pageName, pageName, {}];
      const page = listingPageToPathnameMap[pathname as lpp];
      const isGDP = pathname.includes('group') && pathname !== '/group/all';
      const queryParams = new URL(location.href).searchParams;
      const isHome = pathname === '/home' || pathname === '/';
      const pageFacets = isGDP
        ? [CONST_FORUMS, CONST_FUNCTIONS, CONST_MEMBERS]
        : PathnamesFacets[pathname as keyof typeof PathnamesFacets];
      const dontSendDefaultRequest = //it means req. for default loaded pages without query params
        pageFacets &&
        ((!isHome && !isQueryObjectEmpty(queryParams)) ||
          (isHome && queryParams.has('sort_by')) ||
          isGDP);
      const payload = {
        userId,
        page: '1',
        facetState: {}
      };
      const makeHomePageRequests = () => {
        [
          {
            type: 'all',
            queryKey: [
              'feeds',
              'all',
              {
                type: {
                  all: {
                    facetValueName: 'All Updates',
                    facetValueKey: 'all'
                  }
                }
              }
            ]
          },
          {
            type: CONST_FORUMS,
            queryKey: [
              'feeds',
              'ForumThread',
              {
                type: {
                  ForumThread: {
                    facetValueKey: 'ForumThread',
                    facetValueName: 'Forum'
                  }
                }
              }
            ]
          },
          {
            type: CONST_FUNCTIONS,
            queryKey: [
              'feeds',
              'Function,FnRsvp,FunctionQuestion',
              {
                type: {
                  'Function,FnRsvp,FunctionQuestion': {
                    facetValueKey: 'Function,FnRsvp,FunctionQuestion',
                    facetValueName: 'Functions'
                  }
                }
              }
            ]
          },
          {
            type: CONST_MEMBERS,
            queryKey: [
              'feeds',
              'UserProfile,Nomination',
              {
                type: {
                  'UserProfile,Nomination': {
                    facetValueKey: 'UserProfile,Nomination',
                    facetValueName: 'Members'
                  }
                }
              }
            ]
          },
          {
            type: CONST_GROUPS,
            queryKey: [
              'feeds',
              'MemberToSubgroup',
              {
                type: {
                  MemberToSubgroup: {
                    facetValueKey: 'MemberToSubgroup',
                    facetValueName: 'Groups'
                  }
                }
              }
            ]
          },
          {
            type: CONST_DEALS,
            queryKey: [
              'feeds',
              'DealRedemption,FnDeal',
              {
                type: {
                  'DealRedemption,FnDeal': {
                    facetValueKey: 'DealRedemption,FnDeal',
                    facetValueName: 'Deals'
                  }
                }
              }
            ]
          }
        ].forEach(homepageCategory =>
          queryClient.prefetchInfiniteQuery(
            homepageCategory.queryKey,
            async () => {
              try {
                const result = await makeApiCall('getFeeds', {
                  ...payload,
                  feedsType: homepageCategory.type
                });
                return result.data;
              } catch (err) {
                return null;
              }
            }
          )
        );
      };
      const requestFn = (identifier: string) => async () => {
        try {
          const result = await makeApiCall(
            listingPageToApiMap[identifier as lpa],
            payload
          );
          return result.data;
        } catch (err) {
          return null;
        }
      };
      const nominationsAPI = () =>
        makeApiCall('getNominationStatsInfo', {
          userId
        });
      const makeOtherPreloadingRequests = () => {
        (!isHome || dontSendDefaultRequest) && makeHomePageRequests();

        Object.keys(listingPageToApiMap).forEach(
          pageKey =>
            (dontSendDefaultRequest || page !== pageKey) &&
            queryClient.prefetchInfiniteQuery(
              makeQueryKey(pageKey),
              requestFn(pageKey)
            )
        );

        makeApiCall('getChatUsers', {
          userId,
          page: 1
        }).then(
          res =>
            res?.data?.firstUser &&
            makeApiCall('getUserMessages', {
              userId,
              chatUserId: res?.data?.firstUser,
              page: 1
            })
        );
        makeApiCall('getNotifications', {userId});

        (pathname !== '/nominate' || dontSendDefaultRequest) &&
          nominationsAPI();

        [
          CONST_MEMBERS,
          CONST_DEALS,
          CONST_FORUMS,
          CONST_FUNCTIONS,
          CONST_GROUPS,
          CONST_INVESTORS,
          CONST_PARTNERS,
          'all-updates'
        ].forEach(page => {
          if (
            (Array.isArray(pageFacets)
              ? pageFacets.includes(page)
              : page === pageFacets) ||
            (pathname === '/investors' && page === CONST_INVESTORS)
          ) {
            return;
          }
          const prom = makeApiCall('getFacets', {
            page,
            userId
          });
          if (page === CONST_INVESTORS && pathname !== '/investors')
            prom.then(() => makeApiCall('investmentSettings', {userId}));
        });
      };

      if (pathname === '/investor') {
        makeApiCall('getInvestorDetails', {
          userId,
          type: 'overview'
        });
        queryClient.prefetchInfiniteQuery(
          makeQueryKey(CONST_INVESTOR_LOGIN),
          async () => {
            try {
              const result = await makeApiCall('getInvestorDetails', {
                ...payload,
                type: CONST_OPPORTUNITIES
              });
              return result.data;
            } catch (err) {
              return null;
            }
          }
        );
        queryClient.prefetchInfiniteQuery(
          makeQueryKey(CONST_FUNCTIONS),
          requestFn(CONST_FUNCTIONS)
        );
        nominationsAPI();
        cachePreloaded.current = true;
        return;
      }
      //main logic starts here:
      //load page facets if facets exist no matter what
      if (pageFacets) {
        if (Array.isArray(pageFacets)) {
          pageFacets.forEach((facets, index) => {
            makeApiCall('getFacets', {
              page: facets,
              userId
            }).then(
              () =>
                index == facets.length - 1 &&
                dontSendDefaultRequest &&
                setTimeout(makeOtherPreloadingRequests, 1000)
            );
          });
        } else {
          makeApiCall('getFacets', {
            page: pageFacets,
            userId
          }).then(
            () =>
              dontSendDefaultRequest &&
              setTimeout(makeOtherPreloadingRequests, 1000)
          );
        }
      }
      if (!dontSendDefaultRequest) {
        //Requests for the targeted pages to pre-load
        page &&
          queryClient.prefetchInfiniteQuery(
            makeQueryKey(page),
            requestFn(page)
          );

        pathname === '/nominate' && nominationsAPI();

        if (pathname === '/investors') {
          makeApiCall('getFacets', {page: CONST_INVESTORS, userId});
          makeApiCall('investmentSettings', {userId});
        }

        isHome && makeHomePageRequests();

        setTimeout(makeOtherPreloadingRequests, 600);
      }

      cachePreloaded.current = true;
    }
  }, [session?.user, pathname]);

  return (
    <>
      {pathname !== '/apply/form' && pathname !== '/accounts/login' && (
        <>
          <Navbar />
          {session && <FeedbackBanner />}
        </>
      )}
      <ScrollButton scrollVisibleHeight={100} />
      <main>{children}</main>
      {initializeEditor && (
        <TinyMCEEditor
          init={{
            plugins: [
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'emoticons',
              'preview',
              'anchor',
              'code',
              'fullscreen',
              'media',
              'table',
              'wordcount',
              'autoresize'
            ]
          }}
        />
      )}

      <ToastContainer />
    </>
  );
}
