import {createContext} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';

export const HomeFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {}
});

export const initialStateHomeFacets = {
  type: {
    all: {
      facetValueName: 'All Updates',
      facetValueKey: 'all'
    }
  }
};
interface HomeFacetsProviderProps {
  children: React.ReactNode;
}
export function HomeFacetsProvider({children}: HomeFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateHomeFacets);

  return (
    <HomeFacetsContext.Provider
      value={{
        selectedFacetValues,
        updateFacetValue,
        setSelectedFacetValues,
        applyFacets,
        setApplyFacets
      }}
    >
      {children}
    </HomeFacetsContext.Provider>
  );
}
