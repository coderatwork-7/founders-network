import InfiniteScroll from 'react-infinite-scroller';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStateMembersFacets} from '../ContextProviders/MembersFacetsContext';
import MembersFacets from './membersFacets';
import {Spinner} from '@/ds/Spinner';
import {MembersList} from './membersList';
import {CONST_MEMBERS} from '@/utils/common/constants';

export const MembersDashboard = (
  <Dashboard
    apiName="getMembersPageFeeds"
    initialState={initialStateMembersFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <MembersFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div key={-2} className="p-2 text-center">
              <Spinner />
            </div>
          }
          threshold={2500}
          initialLoad={false}
        >
          {!hasNextPage && !data?.length ? (
            <div className="text-center w-100 mt-4">No Members Found!</div>
          ) : (
            <MembersList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
    baseQueryKey={CONST_MEMBERS}
  />
);
