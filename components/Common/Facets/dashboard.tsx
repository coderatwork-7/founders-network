import {useCallback, useState} from 'react';
import {FacetState} from '@/utils/common/commonTypes';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {useFeeds} from '@/components/Feeds/hooks/useFeeds';
import {useRouter} from 'next/router';
import {facetStateToPayload, makeUrlVariables} from '@/genericApi/helper';
import {FACET_KEY_TYPE} from '@/utils/common/constants';
interface DashboardProps {
  apiName: string;
  initialState: FacetState;
  render: (
    apply: (facetState: FacetState) => void,
    loadMore: () => void,
    hasNextPage: boolean,
    data: string[],
    isFetchingNextPage: boolean
  ) => JSX.Element;
  keyExtractorFn?: (facetState: FacetState) => string[];
  payloadModifier?: (
    facetState: FacetState,
    payload: {[key: string]: any}
  ) => void;
  denormalizeIgnoreFacet?: string[];
  processFacetObject?: (facetObject: {[key: string]: string}) => void;
  baseQueryKey?: string;
  pageName?: string;
  withoutFacets?: boolean;
}

export function Dashboard({
  apiName,
  initialState,
  render,
  keyExtractorFn = facetState => Object.keys(facetState),
  payloadModifier,
  denormalizeIgnoreFacet = [FACET_KEY_TYPE],
  processFacetObject,
  baseQueryKey,
  pageName,
  withoutFacets
}: DashboardProps): JSX.Element {
  const [facetState, setFacetState] = useState<FacetState>(initialState);
  const router = useRouter();
  const [queryEnabled, setQueryEnabled] = useState(!!withoutFacets);
  const makeRequest = useAPI();
  const userInfo = useSelector(selectUserInfo());

  const fetchFeedsData = async ({pageParam = 1}) => {
    if (userInfo) {
      try {
        const requestPayload = {
          page: pageParam || 1,
          facetState,
          userId: userInfo?.id
        };
        payloadModifier?.(facetState, requestPayload);
        const result = await makeRequest(apiName, requestPayload);
        if (result.data) {
          return result.data;
        }
      } catch (err: any) {
        return null;
      }
    }
    return null;
  };

  const {
    data: queryData,
    fetchNextPage,
    hasNextPage = true,
    isFetchingNextPage
  } = useFeeds({
    facetState,
    userInfo,
    fetchFeedsData,
    enabled: queryEnabled,
    baseQueryKey,
    pageName
  });

  const apply = useCallback(
    (facetState: FacetState, navigate = true) => {
      setFacetState(facetState);
      const denormalizedFacetObject = facetStateToPayload(
        facetState,
        denormalizeIgnoreFacet
      );
      processFacetObject?.(denormalizedFacetObject);
      const {query} = makeUrlVariables(
        [],
        keyExtractorFn(facetState),
        denormalizedFacetObject
      );
      navigate &&
        router.replace(
          {pathname: location.pathname, query: query.slice(1)},
          undefined,
          {
            scroll: false,
            shallow: true
          }
        );
      setQueryEnabled(true);
    },
    [queryEnabled]
  );
  const loadMore = useCallback(() => {
    fetchNextPage();
  }, []);

  return render(
    apply,
    loadMore,
    hasNextPage,
    (queryData?.pages[0] &&
      queryData?.pages.flatMap((page: any) => page?.data)) ||
      [],
    isFetchingNextPage
  );
}
