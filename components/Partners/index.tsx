import InfiniteScroll from 'react-infinite-scroller';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStatePartnersFacets} from '../ContextProviders/PartnersFacetsContext';
import PartnersFacets from './partnersFacets';
import {Spinner} from '@/ds/Spinner';
import {PartnersList} from './partnersList';
import {CONST_PARTNERS} from '@/utils/common/constants';

export const PartnersDashboard = (
  <Dashboard
    apiName="getPartnersPageFeeds"
    initialState={initialStatePartnersFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <PartnersFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div className="p-2 text-center" key={-2}>
              <Spinner />
            </div>
          }
          threshold={3000}
          initialLoad={false}
        >
          {!hasNextPage && !data?.length ? (
            <div className="text-center w-100 mt-4">No Partners Found!</div>
          ) : (
            <PartnersList ids={data} />
          )}
        </InfiniteScroll>
      </>
    )}
    baseQueryKey={CONST_PARTNERS}
  />
);
