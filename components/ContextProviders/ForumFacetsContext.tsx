import {createContext} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_FORUMS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const ForumFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateForumFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_FORUMS]: {
      facetValueName: CONST_FORUMS,
      facetValueKey: CONST_FORUMS
    }
  }
};
interface ForumFacetsProviderProps {
  children: React.ReactNode;
}
export function ForumFacetsProvider({children}: ForumFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateForumFacets);

  return (
    <ForumFacetsContext.Provider
      value={{
        selectedFacetValues,
        updateFacetValue,
        setSelectedFacetValues,
        applyFacets,
        setApplyFacets
      }}
    >
      {children}
    </ForumFacetsContext.Provider>
  );
}
