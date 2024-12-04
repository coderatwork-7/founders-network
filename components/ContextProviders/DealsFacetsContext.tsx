import {createContext} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_DEALS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const DealsPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateDealsFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_DEALS]: {
      facetValueName: CONST_DEALS,
      facetValueKey: CONST_DEALS
    }
  }
};
interface DealsPageFacetsProviderProps {
  children: React.ReactNode;
}
export function DealsPageFacetsProvider({
  children
}: DealsPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateDealsFacets);

  return (
    <DealsPageFacetsContext.Provider
      value={{
        selectedFacetValues,
        updateFacetValue,
        setSelectedFacetValues,
        applyFacets,
        setApplyFacets
      }}
    >
      {children}
    </DealsPageFacetsContext.Provider>
  );
}
