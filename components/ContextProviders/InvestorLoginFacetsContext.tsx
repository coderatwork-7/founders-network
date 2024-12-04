import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_INVESTOR_LOGIN, FACET_KEY_TYPE} from '@/utils/common/constants';

export const InvestorLoginFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateInvestorLoginFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_INVESTOR_LOGIN]: {
      facetValueName: CONST_INVESTOR_LOGIN,
      facetValueKey: CONST_INVESTOR_LOGIN
    }
  }
};
interface InvestorLoginFacetsProviderProps {
  children: React.ReactNode;
}
export function InvestorLoginFacetsProvider({
  children
}: InvestorLoginFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateInvestorLoginFacets);

  const contextValues = useMemo(
    () => ({
      selectedFacetValues,
      updateFacetValue,
      setSelectedFacetValues,
      applyFacets,
      setApplyFacets
    }),
    [
      selectedFacetValues,
      updateFacetValue,
      setSelectedFacetValues,
      applyFacets,
      setApplyFacets
    ]
  );

  return (
    <InvestorLoginFacetsContext.Provider value={contextValues}>
      {children}
    </InvestorLoginFacetsContext.Provider>
  );
}
