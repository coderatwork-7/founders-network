import FunctionFacets from './functionFacets';
import InfiniteScroll from 'react-infinite-scroller';
import {FunctionList} from './functionList';
import {Spinner} from '@/ds/Spinner';
import {initialStateFunctionFacets} from '../ContextProviders/FunctionPageFacetsContext';

import {Dashboard} from '../Common/Facets/dashboard';
import {CONST_FUNCTIONS} from '@/utils/common/constants';
const FunctionDashboard = (
  <Dashboard
    apiName="getFunctionPageFeeds"
    initialState={initialStateFunctionFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <FunctionFacets apply={apply} />
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
            <div className="text-center w-100 mt-4">No Functions Found!</div>
          ) : (
            <FunctionList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
    baseQueryKey={CONST_FUNCTIONS}
  />
);
export default FunctionDashboard;
