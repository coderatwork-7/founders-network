import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_PARTNERS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const PartnersPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStatePartnersFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_PARTNERS]: {
      facetValueName: CONST_PARTNERS,
      facetValueKey: CONST_PARTNERS
    }
  }
};
interface PartnersPageFacetsProviderProps {
  children: React.ReactNode;
}
export function PartnersPageFacetsProvider({
  children
}: PartnersPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStatePartnersFacets);

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
    <PartnersPageFacetsContext.Provider value={contextValues}>
      {children}
    </PartnersPageFacetsContext.Provider>
  );
}
