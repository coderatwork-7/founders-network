import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {
  CONST_FUNCTIONS,
  CONST_GROUPS_FUNCTIONS,
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB
} from '@/utils/common/constants';
import {FacetState} from '@/utils/common/commonTypes';

export const GroupsDetailFunctionsFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateGroupsDetailFunctionsFacets: FacetState = {
  [FACET_KEY_TYPE]: {
    [CONST_GROUPS_FUNCTIONS]: {
      facetValueName: CONST_GROUPS_FUNCTIONS,
      facetValueKey: CONST_GROUPS_FUNCTIONS
    }
  },
  [GROUP_ACTIVE_TAB]: {
    [CONST_FUNCTIONS]: {
      facetValueKey: CONST_FUNCTIONS,
      facetValueName: CONST_FUNCTIONS
    }
  }
};
interface GroupsDetailFunctionsFacetsProviderProps {
  children: React.ReactNode;
}
export function GroupsDetailFunctionsFacetsProvider({
  children
}: GroupsDetailFunctionsFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateGroupsDetailFunctionsFacets);

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
    <GroupsDetailFunctionsFacetsContext.Provider value={contextValues}>
      {children}
    </GroupsDetailFunctionsFacetsContext.Provider>
  );
}
