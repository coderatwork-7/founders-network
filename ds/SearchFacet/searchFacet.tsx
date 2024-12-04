import {KeywordInputFacet} from '@/ds/KeywordInputFacet';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, Dispatch, SetStateAction} from 'react';
import classes from './searchFacet.module.scss';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {FacetState} from '@/utils/common/commonTypes';
import useIsMobile from '@/utils/common/useIsMobile';

interface SearchFacetProps {
  setFacetStateInGrandParent: (state: FacetState) => void;
  children: React.ReactNode;
  selectedFacetValues: FacetState;
  updateFacetValue: (obj: FacetState, isMultiselect: boolean) => void;
  setSelectedFacetValues: Dispatch<SetStateAction<FacetState>>;
}

export function SearchFacet({
  setFacetStateInGrandParent,
  children,
  selectedFacetValues,
  setSelectedFacetValues,
  updateFacetValue
}: SearchFacetProps) {
  const isMobile = useIsMobile();

  const apply = useCallback(
    () => setFacetStateInGrandParent(selectedFacetValues),
    [selectedFacetValues]
  );
  const reset = useCallback(() => setSelectedFacetValues({}), []);

  return (
    <div
      className={clsx(
        'text-start',
        'mb-3',
        classes.container,
        isMobile && 'mt-3'
      )}
    >
      {/* <KeywordInputFacet

        icon={faMagnifyingGlass}
        placeholderText="Enter a keyword"
        facetValueOnClick={updateFacetValue}
        selectedItems={selectedFacetValues}
      /> */}
      <div
        className={clsx(classes.facets, 'd-flex align-items-center flex-wrap')}
      >
        {children}
        <span className={clsx('ms-auto', classes.buttons)}>
          <Button
            variant={ButtonVariants.Primary}
            subVariant="verySmall"
            className="mx-1"
            onClick={apply}
          >
            Apply
          </Button>
          <Button
            variant={ButtonVariants.OutlineSecondary}
            subVariant="verySmall"
            onClick={reset}
          >
            Reset
          </Button>
        </span>
      </div>
    </div>
  );
}
