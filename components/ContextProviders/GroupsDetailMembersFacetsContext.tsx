import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {
  CONST_GROUPS_MEMBERS,
  CONST_MEMBERS,
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB
} from '@/utils/common/constants';
import {FacetState} from '@/utils/common/commonTypes';

export const GroupsDetailMembersFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateGroupsDetailMembersFacets: FacetState = {
  [FACET_KEY_TYPE]: {
    [CONST_GROUPS_MEMBERS]: {
      facetValueName: CONST_GROUPS_MEMBERS,
      facetValueKey: CONST_GROUPS_MEMBERS
    }
  },
  [GROUP_ACTIVE_TAB]: {
    [CONST_MEMBERS]: {
      facetValueKey: CONST_MEMBERS,
      facetValueName: CONST_MEMBERS
    }
  }
};
interface GroupsDetailMembersFacetsProviderProps {
  children: React.ReactNode;
}
export function GroupsDetailMembersFacetsProvider({
  children
}: GroupsDetailMembersFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateGroupsDetailMembersFacets);

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
    <GroupsDetailMembersFacetsContext.Provider value={contextValues}>
      {children}
    </GroupsDetailMembersFacetsContext.Provider>
  );
}
