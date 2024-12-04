import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_INVESTORS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const InvestorsPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});

export const initialStateInvestorsFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_INVESTORS]: {
      facetValueName: CONST_INVESTORS,
      facetValueKey: CONST_INVESTORS
    }
  }
};

interface InvestorsPageFacetsProviderProps {
  children: React.ReactNode;
}

export function InvestorsPageFacetsProvider({
  children
}: InvestorsPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateInvestorsFacets);

  const contextValue = useMemo(() => {
    return {
      selectedFacetValues,
      updateFacetValue,
      setSelectedFacetValues,
      applyFacets,
      setApplyFacets
    };
  }, [
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  ]);

  return (
    <InvestorsPageFacetsContext.Provider value={contextValue}>
      {children}
    </InvestorsPageFacetsContext.Provider>
  );
}
