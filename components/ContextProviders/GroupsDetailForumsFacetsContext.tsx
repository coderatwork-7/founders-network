import {createContext, useMemo} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {
  CONST_FORUMS,
  CONST_GROUPS_FORUMS,
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB
} from '@/utils/common/constants';
import {FacetState} from '@/utils/common/commonTypes';

export const GroupsDetailForumsFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateGroupsDetailForumsFacets: FacetState = {
  [FACET_KEY_TYPE]: {
    [CONST_GROUPS_FORUMS]: {
      facetValueName: CONST_GROUPS_FORUMS,
      facetValueKey: CONST_GROUPS_FORUMS
    }
  },
  [GROUP_ACTIVE_TAB]: {
    [CONST_FORUMS]: {
      facetValueKey: CONST_FORUMS,
      facetValueName: CONST_FORUMS
    }
  }
};
interface GroupsDetailForumsFacetsProviderProps {
  children: React.ReactNode;
}
export function GroupsDetailForumsFacetsProvider({
  children
}: GroupsDetailForumsFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateGroupsDetailForumsFacets);

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
    <GroupsDetailForumsFacetsContext.Provider value={contextValues}>
      {children}
    </GroupsDetailForumsFacetsContext.Provider>
  );
}
