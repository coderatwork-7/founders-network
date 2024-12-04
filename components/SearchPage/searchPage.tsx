import React, {useCallback, useEffect, useMemo, useState} from 'react';
import classes from './searchPage.module.scss';
import clsx from 'clsx';
import ForumCard from '@/components/Cards/Forum/forumCard';
import Link from 'next/link';
import SelectorWrapper from '../Common/selectorWrapper';
import useAPI from '@/utils/common/useAPI';
import useScrollVisible from '@/hooks/useScrollVisible';
import {useSelector} from 'react-redux';
import {
  selectApiState,
  selectDeal,
  selectForumPost,
  selectUserInfo
} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {FEEDS_TYPE} from '@/utils/common/constants';
import {DealsPageCard} from '../Deals/DealsPageCard/dealsPageCard';
import {FunctionList} from '../Function/functionList';
import {MembersList} from '../Members/membersList';
import {PartnersList} from '../Partners/partnersList';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {useSearchParams} from 'next/navigation';
import {typeToURLMap} from '../SearchTypeahead/SearchGroup/searchGroup';
import {DEALS_PAGE_MAP} from '@/utils/common/apiToStoreMaps';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRightLong} from '@fortawesome/free-solid-svg-icons';

type SearchResultsType = {
  [key: string]: {
    ids: string[];
    count: number;
  };
};

interface GroupHeadingProps {
  type: string;
  count: number;
  searchTerm: string;
}

const searchMap: {[key: string]: any} = {
  [FEEDS_TYPE.FUNCTIONS]: {
    order: 1,
    component: FunctionList,
    groupClassName: classes.functions,
    groupHeading: 'Functions',
    limit: 6
  },
  [FEEDS_TYPE.MEMBERS]: {
    order: 2,
    component: MembersList,
    groupClassName: classes.members,
    groupHeading: 'Members',
    limit: 6
  },
  [FEEDS_TYPE.PARTNERS]: {
    order: 3,
    component: PartnersList,
    groupClassName: classes.partners,
    groupHeading: 'Partners',
    limit: 6
  },
  [FEEDS_TYPE.FORUMS]: {
    order: 4,
    component: ForumList,
    groupClassName: classes.forums,
    groupHeading: 'Forum Results',
    limit: 4
  },
  [FEEDS_TYPE.DEALS]: {
    order: 5,
    component: DealsList,
    groupClassName: classes.deals,
    groupHeading: 'Deals',
    limit: 6
  }
};

const searchMapSorter = (k1: string, k2: string) =>
  +searchMap[k1].order - +searchMap[k2].order;

export const SearchPage: React.FC<{
  setSearchGroups: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveSearchGroup: (activeId: string) => void;
}> = ({setSearchGroups, setActiveSearchGroup}) => {
  const makeApiCall = useAPI();
  const [searchResults, setSearchResults] = useState<SearchResultsType>({});
  const searchTerm = useSearchParams().get('q');
  const userInfo = useSelector(selectUserInfo());
  const isLoading = useSelector(selectApiState('getSearchResults'));

  const searchResultKeys = useMemo(() => {
    return Object.keys(searchResults)
      .filter(type => type in searchMap && searchResults[type].count)
      .sort(searchMapSorter);
  }, [searchResults]);

  const getSearchResults = useCallback(
    () =>
      makeApiCall('getSearchResults', {
        q: searchTerm,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      }),
    [makeApiCall, searchTerm]
  );

  const handleActiveGroup = useCallback(
    (id: string | null) => setActiveSearchGroup(id ?? searchResultKeys[0]),
    [searchResultKeys]
  );

  useScrollVisible(searchResultKeys, handleActiveGroup);

  useEffect(() => {
    if (!userInfo?.id || !searchTerm) return;

    setSearchResults({});
    setSearchGroups([]);

    getSearchResults().then(res => {
      const keys = Object.keys(res.data)
        .filter(key => res.data[key].ids.length)
        .sort(searchMapSorter);

      setSearchGroups(keys);
      setActiveSearchGroup(keys[0]);
      setSearchResults(res.data);
    });
  }, [userInfo?.id, searchTerm]);

  return (
    <>
      {isLoading || !searchTerm ? (
        <div className={classes.loadingContainer}>
          <Spinner />
        </div>
      ) : (
        <section className={classes.sectionWrapper}>
          {searchResultKeys.map(type => {
            const {
              component: GenericList,
              groupHeading,
              groupClassName,
              limit
            } = searchMap[type];
            return GenericList && searchResults?.[type].ids.length ? (
              <div key={type} className={classes.searchGroup}>
                <GroupHeading
                  type={type}
                  searchTerm={searchTerm.trim()}
                  count={searchResults?.[type].count}
                />
                <div className={clsx(classes.cardsList, groupClassName)}>
                  <GenericList
                    ids={searchResults?.[type].ids.slice(0, limit)}
                    onSearchPage={true}
                  />
                </div>
                <Link
                  href={typeToURLMap[type] + searchTerm?.trim()}
                  className={clsx(classes.groupPageLink, classes.cardEnd)}
                >
                  <div>{`View All ${groupHeading}`}</div>
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </Link>
              </div>
            ) : null;
          })}

          {!searchResultKeys.length && (
            <div
              className={classes.err}
            >{`No results found for "${searchTerm}" !`}</div>
          )}
        </section>
      )}
    </>
  );
};

function ForumList({ids}: {ids: string[]}) {
  return (
    <>
      {ids?.map((id: string) => (
        <SelectorWrapper
          key={id}
          id={id}
          selector={selectForumPost}
          Component={ForumCard}
        />
      ))}
    </>
  );
}

function DealsList({ids}: {ids: string[]}) {
  return (
    <>
      {ids?.map(id => (
        <SelectorWrapper
          key={id}
          id={id}
          selector={selectDeal}
          Component={DealsPageCard}
          props={{selectedTab: 0}}
          dataMap={DEALS_PAGE_MAP}
        />
      ))}
    </>
  );
}

const GroupHeading: React.FC<GroupHeadingProps> = ({
  type,
  count,
  searchTerm
}) => {
  const groupHeading = searchMap[type].groupHeading;

  return (
    <div className={classes.grouHeading} id={type}>
      <div className={classes.groupName}>{`${groupHeading} - ${count}`}</div>
      <Link
        href={typeToURLMap[type] + searchTerm?.trim()}
        className={classes.groupPageLink}
      >
        <div>{`View All ${groupHeading}`}</div>
        <FontAwesomeIcon icon={faArrowRightLong} />
      </Link>
    </div>
  );
};
