import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_GROUPS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const GroupsPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateGroupsFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_GROUPS]: {
      facetValueName: CONST_GROUPS,
      facetValueKey: CONST_GROUPS
    }
  }
};
interface GroupsPageFacetsProviderProps {
  children: React.ReactNode;
}
export function GroupsPageFacetsProvider({
  children
}: GroupsPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateGroupsFacets);

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
    <GroupsPageFacetsContext.Provider value={contextValues}>
      {children}
    </GroupsPageFacetsContext.Provider>
  );
}
