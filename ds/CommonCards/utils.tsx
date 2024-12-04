import {FacetUtils} from '@/components/Common/Facets/useFacetState';
import {setAndMergeFacetState} from '@/utils/common/helper';
import clsx from 'clsx';
import React from 'react';

// TODO: Add Filter click Login.
export const handleFilterClick = (
  type: string,
  id: string,
  name: string,
  setSelectedFacetValues?: FacetUtils['setSelectedFacetValues'],
  setApplyFacets?: FacetUtils['setApplyFacets']
) => {
  setAndMergeFacetState(
    setSelectedFacetValues,
    type === 'city' ? 'location' : type,
    {[id]: {facetValueKey: id, facetValueName: name}},
    setApplyFacets
  );
};

export const mapFilterNames = (
  filterItems: Array<{id: string; name: string}>,
  filterType: string,
  popoverCard?: boolean,
  setSelectedFacetValues?: FacetUtils['setSelectedFacetValues'],
  setApplyFacets?: FacetUtils['setApplyFacets']
) => (
  <>
    {filterItems.map((filterItem, index) => (
      <React.Fragment key={`${filterType}_${filterItem.id}`}>
        <a
          className={clsx(popoverCard ? 'text-muted' : 'text-link')}
          onClick={() =>
            popoverCard
              ? null
              : handleFilterClick(
                  filterType,
                  filterItem.id,
                  filterItem.name,
                  setSelectedFacetValues,
                  setApplyFacets
                )
          }
        >
          {filterItem.name}
        </a>
        {index !== filterItems.length - 1 && ', '}
      </React.Fragment>
    ))}
  </>
);
