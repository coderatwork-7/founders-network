import React, {useState, useCallback, useRef} from 'react';
import {FacetState, FacetValue} from '@/utils/common/commonTypes';
export const useFacetState = (intialState?: FacetState) => {
  const [selectedFacetValues, setSelectedFacetValues] = useState<FacetState>(
    intialState ?? {}
  );
  const [applyFacets, setApplyFacets] = useState(false);
  const maxIndex = useRef(0);
  const updateFacetValue = useCallback(
    (obj: FacetState, isMultiselect: boolean) => {
      const facetKey = Object.keys(obj)[0];
      const facetValueKey = Object.keys(obj[facetKey])[0];
      const facetValueObject = obj[facetKey][facetValueKey];

      if (selectedFacetValues?.[facetKey]?.[facetValueKey]) {
        setSelectedFacetValues(prev => {
          const {[facetValueKey]: _, ...rest} = prev[facetKey]; // eslint-disable-line no-unused-vars
          return {...prev, [facetKey]: rest};
        });
      } else {
        setSelectedFacetValues(prev => {
          facetValueObject &&
            ((
              facetValueObject as FacetValue & {displayOrder: number}
            ).displayOrder = ++maxIndex.current);
          return isMultiselect
            ? {...prev, [facetKey]: {...prev[facetKey], ...obj[facetKey]}}
            : {...prev, [facetKey]: obj[facetKey]};
        });
      }
    },
    [selectedFacetValues]
  );
  return {
    selectedFacetValues,
    updateFacetValue,
    setSelectedFacetValues,
    applyFacets,
    setApplyFacets
  };
};

export interface FacetUtils {
  selectedFacetValues: FacetState;
  setSelectedFacetValues: React.Dispatch<React.SetStateAction<FacetState>>;
  updateFacetValue: (obj: FacetState, isMultiselect: boolean) => void; // eslint-disable-line no-unused-vars
  applyFacets?: boolean;
  setApplyFacets?: React.Dispatch<React.SetStateAction<boolean>>;
}
