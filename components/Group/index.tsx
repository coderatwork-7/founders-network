import InfiniteScroll from 'react-infinite-scroller';
import {Dashboard} from '../Common/Facets/dashboard';
import {Spinner} from '@/ds/Spinner';
import {CONST_GROUPS} from '@/utils/common/constants';
import {initialStateGroupsFacets} from '../ContextProviders/GroupsFacetsContext';
import GroupsFacets from './groupsFacets';
import {GroupsList} from './groupsList';

export const GroupsDashboard = (
  <Dashboard
    apiName="getGroupsPageFeeds"
    initialState={initialStateGroupsFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <GroupsFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div key={-2} className="p-2 text-center">
              <Spinner />
            </div>
          }
          threshold={3000}
          initialLoad={false}
        >
          {!hasNextPage && !data?.length ? (
            <div className="text-center w-100 mt-4">No Groups Found!</div>
          ) : (
            <GroupsList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
    baseQueryKey={CONST_GROUPS}
  />
);
