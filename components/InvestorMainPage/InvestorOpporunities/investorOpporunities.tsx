import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {InvestmentInfo} from '../InvestmentInfo/investmentInfo';
import styles from './investorOpporunities.module.scss';
import InfiniteScroll from 'react-infinite-scroller';
import {Dashboard} from '@/components/Common/Facets/dashboard';
import {CONST_INVESTOR_LOGIN} from '@/utils/common/constants';
import {InvestorList} from '../InvestorList/investorList';
import {Spinner} from '@/ds/Spinner';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import {initialStateInvestorLoginFacets} from '@/components/ContextProviders/InvestorLoginFacetsContext';
import {InvestorLoginFacets} from '../investorLoginFacets';

export const InvestorOpporunities = () => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <div className={clsx('d-flex gap-4', isMobile && 'flex-column')}>
      <div className={styles.leftContainer}>
        <div className="mb-3">
          <InvestmentInfo />
        </div>
        {!isMobile && (
          <div>
            <NominationWidget />
          </div>
        )}
      </div>
      <div className={styles.centerContainer}>
        <Dashboard
          apiName="getInvestorDetails"
          payloadModifier={(_, requestPayload) => {
            requestPayload.type = 'opportunities';
          }}
          initialState={initialStateInvestorLoginFacets}
          render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => {
            return (
              <>
                <div className={styles.headerContainer}>
                  <h5>
                    FN Members seeking investment who match your Investment
                    Preferences
                  </h5>
                </div>
                <InvestorLoginFacets apply={apply} />
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
                  <InvestorList ids={data} />
                </InfiniteScroll>
              </>
            );
          }}
          baseQueryKey={CONST_INVESTOR_LOGIN}
        />
      </div>
    </div>
  );
};
