import {FacetState} from '@/utils/common/commonTypes';
import {FACET_KEY_TYPE} from '@/utils/common/constants';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Session} from 'next-auth';

const filteredFacetState = (obj: any): FacetState => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const newObj: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (key === FACET_KEY_TYPE) {
      continue;
    }

    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      const updatedValue = filteredFacetState(value);
      if (Object.keys(updatedValue).length > 0) {
        newObj[key] = updatedValue;
      }
    } else if (['facetValueKey', 'facetValueName'].includes(key)) {
      newObj[key] = value;
    }
  }

  return newObj;
};

export const useFeeds = ({
  facetState,
  userInfo,
  fetchFeedsData,
  baseQueryKey,
  enabled,
  pageName
}: {
  facetState: FacetState;
  userInfo: Session['user'];
  // eslint-disable-next-line no-unused-vars
  fetchFeedsData: ({pageParam}: {pageParam?: number}) => Promise<any>;
  baseQueryKey?: string;
  enabled?: boolean;
  pageName?: string;
}) => {
  const TYPE_KEY = pageName !== 'home' ? FACET_KEY_TYPE : 'type';
  return useInfiniteQuery({
    queryKey: [
      ...(baseQueryKey ? [baseQueryKey] : []),
      (facetState?.[TYPE_KEY] && Object.keys(facetState?.[TYPE_KEY])?.[0]) ||
        'all',
      filteredFacetState(facetState)
    ],
    enabled: Boolean(enabled && userInfo?.id),
    queryFn: fetchFeedsData,
    getNextPageParam: lastPage => {
      return lastPage?.next?.match(/page=(\d+)/)?.[1];
    }
  });
};
