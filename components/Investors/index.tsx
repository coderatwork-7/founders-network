import InfiniteScroll from 'react-infinite-scroller';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStateInvestorsFacets} from '../ContextProviders/InvestorsFacetsContext';
import InvestorsFacets from './investorsFacets';
import {Spinner} from '@/ds/Spinner';
import {InvestorsList} from './investorsList';

export const InvestorsDashboard = (
  <Dashboard
    apiName="getInvestorsPageFeeds"
    initialState={initialStateInvestorsFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <InvestorsFacets apply={apply} />
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
            <div className="text-center w-100 mt-4">No Investors Found!</div>
          ) : (
            <InvestorsList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
    baseQueryKey="investors"
  />
);
