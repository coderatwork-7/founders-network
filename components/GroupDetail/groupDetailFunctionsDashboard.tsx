import {CONST_GROUPS_FUNCTIONS} from '@/utils/common/constants';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStateGroupsDetailFunctionsFacets} from '../ContextProviders/GroupsDetailFunctionsFacetsContext';
import InfiniteScroll from 'react-infinite-scroller';
import {Spinner} from '@/ds/Spinner';
import {FunctionList} from '../Function/functionList';
import {GroupDetailFunctionsFacets} from './groupDetailFunctionsFacets';
import {keyExtractorForGDP} from './groupDetailMembersDashboard';

export const GroupDetailFunctionsDashboard = (
  <Dashboard
    apiName="getFunctionPageFeeds"
    keyExtractorFn={keyExtractorForGDP}
    initialState={initialStateGroupsDetailFunctionsFacets}
    baseQueryKey={CONST_GROUPS_FUNCTIONS}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <GroupDetailFunctionsFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div className="p-2 text-center" key={-2}>
              <Spinner />
            </div>
          }
          threshold={2500}
          initialLoad={false}
        >
          {!hasNextPage && !data?.length ? (
            <div className="text-center w-100 mt-4">No Functions Found!</div>
          ) : (
            <FunctionList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
  />
);
