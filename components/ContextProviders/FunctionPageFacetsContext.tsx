import {createContext} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_FUNCTIONS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const FunctionPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateFunctionFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_FUNCTIONS]: {
      facetValueName: CONST_FUNCTIONS,
      facetValueKey: CONST_FUNCTIONS
    }
  }
};
interface FunctionPageFacetsProviderProps {
  children: React.ReactNode;
}
export function FunctionPageFacetsProvider({
  children
}: FunctionPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateFunctionFacets);

  return (
    <FunctionPageFacetsContext.Provider
      value={{
        selectedFacetValues,
        updateFacetValue,
        setSelectedFacetValues,
        applyFacets,
        setApplyFacets
      }}
    >
      {children}
    </FunctionPageFacetsContext.Provider>
  );
}
