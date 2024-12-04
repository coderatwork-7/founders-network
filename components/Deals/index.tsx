import {useState} from 'react';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStateDealsFacets} from '../ContextProviders/DealsFacetsContext';

import DealsFacets from './dealsFacets';
import {DealsList} from './dealsList';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';

import {
  CONST_DEALS,
  LAUNCH,
  LEAD,
  LIFETIME,
  SCALE
} from '@/utils/common/constants';
import {selectUserInfo} from '@/store/selectors';
import LockCard from '../../ds/LockCard/LockCard';

import {useSession} from 'next-auth/react';
import FnTabNavigation from '@/ds/FNTabNavigation';
import {plans} from '@/utils/data/plans';
import {useDealsQuery} from '@/genericApi/foundersNetwork/queries';
import {IDeals} from '@/genericApi/foundersNetwork/queries/useDealsQuery';
import {IDeal} from '@/utils/interfaces/deal';

export function DealsDashboard() {
  const loading = useSelector(selectApiState('getDeals'));
  const {paymentPlan} = useSelector(selectUserInfo()) || {};
  const resultsLoading = loading == undefined || loading;

  const {data: session} = useSession();

  const getPlan = () => {
    switch (session?.user.paymentPlan) {
      case 'bootstrap':
        return LAUNCH;
      case 'angel':
        return SCALE;
      case 'seriesa':
        return LEAD;
      case 'lifetime':
        return LIFETIME;
      default:
        return LAUNCH;
    }
  };

  const plan = getPlan();

  const [selectedTab, setSelectedTab] = useState(plan);

  const {data: deals, isLoading} = useDealsQuery();

  return (
    <Dashboard
      apiName="getDeals"
      initialState={initialStateDealsFacets}
      render={(apply, hasNextPage) => (
        <>
          <DealsFacets apply={apply} />
          {resultsLoading ? (
            <Spinner />
          ) : (
            <>
              <FnTabNavigation
                tabs={plans}
                activeTab={selectedTab}
                setActiveTab={setSelectedTab}
              />

              {paymentPlan === 'bootstrap' && <LockCard />}

              {isLoading ? (
                <Spinner />
              ) : (
                deals && (
                  <DealsList
                    data={
                      deals[
                        selectedTab.toLowerCase() as keyof IDeals
                      ] as IDeal[]
                    }
                    selectedTab={selectedTab}
                  />
                )
              )}
            </>
          )}
        </>
      )}
      baseQueryKey={CONST_DEALS}
    />
  );
}
