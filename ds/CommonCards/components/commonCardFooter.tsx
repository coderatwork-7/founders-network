import CardFooter from '@/ds/Card/cardFooter';
import clsx from 'clsx';
import classes from '../commonCards.module.scss';
import React, {useContext} from 'react';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {handleFilterClick, mapFilterNames} from '../utils';
import {
  CONST_GROUPS_MEMBERS,
  CONST_INVESTOR,
  CONST_MEMBER,
  CONST_PARTNER
} from '@/utils/common/constants';
import {MembersPageFacetsContext} from '@/components/ContextProviders/MembersFacetsContext';
import {InvestorsPageFacetsContext} from '@/components/ContextProviders/InvestorsFacetsContext';
import {PartnersPageFacetsContext} from '@/components/ContextProviders/PartnersFacetsContext';
import {capitalize} from '@/utils/common/helper';
import {GroupsDetailMembersFacetsContext} from '@/components/ContextProviders/GroupsDetailMembersFacetsContext';

const DEFAULT_CITY = {
  id: 'agnostic',
  name: 'Agnostic'
};

type info = {
  name: string;
  id: string;
  key?: string;
};

export const CONTEXT_MAP = {
  [CONST_MEMBER]: MembersPageFacetsContext,
  [CONST_INVESTOR]: InvestorsPageFacetsContext,
  [CONST_PARTNER]: PartnersPageFacetsContext,
  [CONST_GROUPS_MEMBERS]: GroupsDetailMembersFacetsContext
};

interface CommonCardFooterProps {
  city: info | info[];
  stage?: info;
  investsIn?: info[];
  sector: info[];
  popoverCard: boolean;
  cardType?: keyof typeof CONTEXT_MAP;
}

export const CommonCardFooter = ({
  city,
  stage,
  investsIn,
  sector,
  popoverCard,
  cardType = CONST_MEMBER
}: CommonCardFooterProps) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  let cityNames;
  const {setSelectedFacetValues, setApplyFacets} = useContext(
    CONTEXT_MAP[cardType]
  );

  const sectorNames = mapFilterNames(
    sector?.slice(0, 5) || [],
    'sector',
    popoverCard,
    setSelectedFacetValues,
    setApplyFacets
  );

  const investsInNames = investsIn
    ? mapFilterNames(
        investsIn?.slice(0, 5) || [],
        'investsIn',
        popoverCard,
        setSelectedFacetValues,
        setApplyFacets
      )
    : null;

  if (Array.isArray(city)) {
    cityNames = mapFilterNames(
      city.length ? city?.slice(0, 5) || [] : [DEFAULT_CITY],
      'city',
      popoverCard,
      setSelectedFacetValues,
      setApplyFacets
    );
  } else {
    cityNames = (
      <a
        className={clsx(popoverCard ? 'text-muted' : 'text-link')}
        onClick={() =>
          popoverCard
            ? null
            : handleFilterClick(
                'city',
                city.id,
                city.name,
                setSelectedFacetValues,
                setApplyFacets
              )
        }
      >
        {city.name}
      </a>
    );
  }

  return (
    <CardFooter>
      <div
        className={clsx(
          classes.footer,
          'w-100',
          'd-flex',
          'rounded-bottom',
          'px-2 gap-2',
          !isMobile && 'align-items-center',
          isMobile && 'flex-column',
          isMobile && classes.mobile,
          popoverCard && classes.popoverCard
        )}
      >
        <div
          className={clsx('text-truncate', popoverCard && classes.popoverField)}
        >
          City: {cityNames}
        </div>
        {stage !== undefined && (
          <div
            className={clsx(
              'text-truncate',
              popoverCard && classes.popoverField
            )}
          >
            Stage:{' '}
            <a
              className={clsx(popoverCard ? 'text-muted' : 'text-link')}
              onClick={() => {
                if (popoverCard) return null;
                return handleFilterClick(
                  'stage',
                  cardType === CONST_PARTNER ? stage?.key ?? '' : stage.id,
                  stage.name,
                  setSelectedFacetValues,
                  setApplyFacets
                );
              }}
            >
              {capitalize(stage.name)}
            </a>
          </div>
        )}
        {!!investsIn && (
          <div
            className={clsx(
              classes.sector,
              'text-truncate',
              popoverCard && classes.popoverField
            )}
          >
            Invests In: {investsInNames}
          </div>
        )}
        <div
          className={clsx(
            classes.sector,
            'text-truncate',
            popoverCard && classes.popoverField
          )}
        >
          Sector: {sectorNames}
        </div>
      </div>
    </CardFooter>
  );
};
