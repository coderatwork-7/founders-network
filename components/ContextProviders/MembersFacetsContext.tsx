import {createContext} from 'react';
import {useFacetState, FacetUtils} from '../Common/Facets/useFacetState';
import {CONST_MEMBERS, FACET_KEY_TYPE} from '@/utils/common/constants';

export const MembersPageFacetsContext = createContext<FacetUtils>({
  selectedFacetValues: {},
  setSelectedFacetValues: () => {},
  updateFacetValue: () => {},
  applyFacets: false,
  setApplyFacets: () => {}
});
export const initialStateMembersFacets = {
  [FACET_KEY_TYPE]: {
    [CONST_MEMBERS]: {
      facetValueName: CONST_MEMBERS,
      facetValueKey: CONST_MEMBERS
    }
  }
};
interface MembersPageFacetsProviderProps {
  children: React.ReactNode;
}
export function MembersPageFacetsProvider({
  children
}: MembersPageFacetsProviderProps) {
  const {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  } = useFacetState(initialStateMembersFacets);

  return (
    <MembersPageFacetsContext.Provider
      value={{
        selectedFacetValues,
        updateFacetValue,
        setSelectedFacetValues,
        applyFacets,
        setApplyFacets
      }}
    >
      {children}
    </MembersPageFacetsContext.Provider>
  );
}
