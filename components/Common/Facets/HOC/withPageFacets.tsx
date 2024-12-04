import useAPI from '@/utils/common/useAPI';
import {
  selectApiState,
  selectFacets,
  selectUserInfo,
  selectInvestmentSettings
} from '@/store/selectors';
import {KeywordInputFacet} from '@/ds/KeywordInputFacet';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  Context,
  useState
} from 'react';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {FacetState, PageFacetsProps} from '@/utils/common/commonTypes';
import useIsMobile from '@/utils/common/useIsMobile';
import classes from '@/styles/Facets.module.scss';
import {useSelector} from 'react-redux';
import {PopoverFacet} from '@/ds/PopoverFacet';
import {PopoverFacetProps} from '@/ds/PopoverFacet/popoverFacet';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {usePathname, useSearchParams} from 'next/navigation';
import {facetStateFromUrl, sizeOfQueryObject} from '@/utils/common/helper';
import {FacetUtils} from '../useFacetState';
import {
  CONST_FORUMS,
  CONST_FUNCTIONS,
  CONST_INVESTORS,
  CONST_MEMBERS,
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB,
  INVESTOR_DEFAULT_SEARCH_PARAM
} from '@/utils/common/constants';
import {initialStateHomeFacets} from '@/components/ContextProviders/HomeFacetsContext';
const color = {
  ['all-updates']: {
    all: 'grayDarkClass',
    ForumThread: 'greenLightClass',
    ['Function,FnRsvp,FunctionQuestion']: 'regentBlueClass',
    ['UserProfile,Nomination']: 'goldenTainoiClass',
    MemberToSubgroup: 'grayishBlueClass',
    ['DealRedemption,FnDeal']: 'lightSalomClass'
  }
};
const afterFacetLoad = (
  isGDP: boolean,
  searchParams: URLSearchParams,
  page: string
): boolean => {
  if (!isGDP) return true;
  if (searchParams.has(GROUP_ACTIVE_TAB)) {
    return searchParams.get(GROUP_ACTIVE_TAB) === page;
  } else return page === CONST_FORUMS;
};
export function withPageFacets(
  page: string,
  context: Context<FacetUtils>
): React.ComponentType<PageFacetsProps> {
  return function ({apply}: PageFacetsProps) {
    const {
      selectedFacetValues,
      updateFacetValue,
      setSelectedFacetValues,
      applyFacets,
      setApplyFacets
    } = useContext(context);

    const makeApiCall = useAPI();
    const isMobile = useIsMobile();
    const userInfo = useSelector(selectUserInfo());
    const facets = useSelector(selectFacets(page));
    const query = useSearchParams();
    const pathname = usePathname();
    const [initial, setInitial] = useState(true);
    const loadingFacets = !!useSelector(selectApiState('getFacets'));
    const [navigate, setNavigate] = useState(true);

    useEffect(() => {
      const makeRequest = async () => {
        await makeApiCall('getFacets', {
          page,
          userId: userInfo?.id,
          concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
        });
      };
      if (!loadingFacets && !facets && userInfo?.id) makeRequest();
    }, [userInfo?.id]);

    useEffect(() => {
      if (applyFacets) {
        page === CONST_MEMBERS &&
          selectedFacetValues?.objective_lookup &&
          setSelectedFacetValues(prev => {
            const {objective_lookup, ...rest} = prev;
            return rest;
          });

        setApplyFacets?.(false);
        setNavigate(true);
      } else if (initial && facets?.length && userInfo?.id && pathname) {
        const searchParams = new URL(location.href).searchParams;
        const urlFacetState: FacetState = facetStateFromUrl(searchParams);

        // Add Bootstrap stage value if pathname is /investors and stage is not present
        //   console.log('urlFacetState.stage', urlFacetState.stage)

        if (pathname === '/investors' && urlFacetState.stage === undefined) {
          urlFacetState.stage = {
            1: {
              facetValueKey: '1',
              facetValueName: 'Bootstrap'
            }
          };
          console.log('urlFacetState.stage 2', urlFacetState.stage);
        }

        if (urlFacetState.feed_filter) {
          urlFacetState.type = urlFacetState.feed_filter;
          delete urlFacetState.feed_filter;
        }

        facets.forEach((facetObj: any) => {
          const facetKey = facetObj.facet.key;
          facetObj.facetValues.forEach((facetValue: any) => {
            if (urlFacetState?.[facetKey]?.[facetValue.key]) {
              urlFacetState[facetKey][facetValue.key] = {
                facetValueKey: facetValue.key,
                facetValueName: facetValue.name
              };
            }
          });
        });

        if (urlFacetState?.start_date) {
          const date = Object.keys(urlFacetState.start_date)[0];
          urlFacetState.start_date = {
            [date]: {facetValueKey: date, facetValueName: date}
          };
        }

        setSelectedFacetValues(prev => ({
          ...prev,
          ...urlFacetState
        }));

        const isGDP = pathname.includes('group') && pathname !== '/group/all';
        const groupId = pathname?.slice(1)?.split?.('/')?.[1];

        if (
          page === CONST_INVESTORS &&
          query.has(INVESTOR_DEFAULT_SEARCH_PARAM)
        ) {
          delete urlFacetState[INVESTOR_DEFAULT_SEARCH_PARAM];
        } else {
          const loadAfterFacetsLoad = afterFacetLoad(isGDP, searchParams, page);
          setSelectedFacetValues(prev => ({
            ...(page === 'all-updates'
              ? {type: prev.type}
              : {
                  ...(isGDP
                    ? {
                        groupId: {
                          [groupId]: {
                            facetValueKey: groupId,
                            facetValueName: groupId
                          }
                        },
                        [GROUP_ACTIVE_TAB]: {
                          [page]: {
                            facetValueKey: page,
                            facetValueName: page
                          }
                        }
                      }
                    : undefined),
                  [FACET_KEY_TYPE]: prev?.[FACET_KEY_TYPE]
                }),
            ...(loadAfterFacetsLoad && urlFacetState)
          }));

          !loadAfterFacetsLoad && setNavigate(false);
        }

        setApplyFacets?.(true);
        setInitial(false);
      } else if (
        initial &&
        pathname?.includes('group') &&
        pathname !== '/group/all'
      ) {
        const searchParams = new URL(location.href).searchParams;
        searchParams.get('sort') === 'upcoming' && searchParams.delete('sort');

        const paramsSize = sizeOfQueryObject(searchParams);
        if (
          paramsSize === 0 ||
          (paramsSize == 1 && searchParams.has(GROUP_ACTIVE_TAB))
        ) {
          const groupId = pathname?.slice(1)?.split?.('/')?.[1];
          const tabFacetKey =
            searchParams.get(GROUP_ACTIVE_TAB) ?? CONST_FORUMS;
          setSelectedFacetValues(prev => ({
            ...prev,
            groupId: {
              [groupId]: {
                facetValueKey: groupId,
                facetValueName: groupId
              }
            },
            [GROUP_ACTIVE_TAB]: {
              [tabFacetKey]: {
                facetValueKey: tabFacetKey,
                facetValueName: tabFacetKey
              }
            },
            ...{[FACET_KEY_TYPE]: prev?.[FACET_KEY_TYPE]},
            ...(tabFacetKey === CONST_FUNCTIONS && {
              sort: {
                upcoming: {
                  facetValueKey: 'upcoming',
                  facetValueName: 'upcoming'
                }
              }
            })
          }));

          setApplyFacets?.(true);
          setInitial(false);
          !afterFacetLoad(true, searchParams, page) && setNavigate(false);
        }
      }
    }, [facets, query, userInfo?.id, pathname, applyFacets]);

    useEffect(() => {
      if (applyFacets) {
        apply(selectedFacetValues, navigate);
      }
    }, [applyFacets]);

    const applyButtonClickHandler = useCallback(() => {
      setApplyFacets?.(true);
    }, []);

    const reset = useCallback(() => {
      setSelectedFacetValues(prev =>
        page === 'all-updates'
          ? initialStateHomeFacets
          : {
              [FACET_KEY_TYPE]: prev?.[FACET_KEY_TYPE],
              ...(prev?.groupId ? {groupId: prev.groupId} : undefined),
              ...(prev?.[GROUP_ACTIVE_TAB] && {
                [GROUP_ACTIVE_TAB]: prev[GROUP_ACTIVE_TAB]
              })
            }
      );
      setApplyFacets?.(true);
    }, []);
    const dropdowns = useMemo(
      () =>
        facets?.map(
          (
            {facet, facetValues, config: {isMultiselect, isSearchable}}: any,
            index: number
          ) => (
            <PopoverFacet
              key={facet.key}
              facetKey={facet.key}
              facetName={facet.name}
              trigger="hover"
              facetValueOnClick={updateFacetValue}
              isMultiselect={isMultiselect}
              isSearchable={isSearchable}
              facetValues={facetValues.map(
                ({
                  key,
                  count,
                  name
                }: any): Exclude<
                  PopoverFacetProps['facetValues'],
                  undefined
                >[0] => ({
                  facetValueKey: key,
                  facetValueName: name,
                  facetValueCount: count,
                  facetValueColor:
                    color?.[page as keyof typeof color]?.[
                      key as keyof (typeof color)[keyof typeof color]
                    ]
                })
              )}
              selectedItems={selectedFacetValues}
              startingFacet={!index}
            />
          )
        ),
      [facets, selectedFacetValues]
    );

    return (
      <div
        className={clsx(
          'text-start',
          'mb-3',
          classes.container,
          isMobile && 'mt-3',
          !facets && 'invisible'
        )}
      >
        <KeywordInputFacet
          facetKey="q"
          facetName={`${page} keyword search`}
          icon={faMagnifyingGlass}
          placeholderText="Enter a keyword"
          facetValueOnClick={updateFacetValue}
          selectedItems={selectedFacetValues}
          ignoredFacetKeys={
            page !== 'all-updates'
              ? {
                  [FACET_KEY_TYPE]: true,
                  objective_lookup: true,
                  groupId: true,
                  [GROUP_ACTIVE_TAB]: true
                }
              : {}
          }
          setApplyFacets={setApplyFacets}
        />

        <div
          className={clsx(
            classes.facets,
            'd-flex align-items-center flex-wrap',
            isMobile && 'ps-3'
          )}
        >
          <div
            className={clsx(
              isMobile ? classes.gridMobile : classes.gridDesktop,
              classes.dropdowns
            )}
          >
            {dropdowns}
          </div>
          <div
            className={isMobile ? classes.buttonMobile : classes.buttonDesktop}
          >
            <span className={clsx('ms-auto', classes.buttons)}>
              <Button
                variant={ButtonVariants.Primary}
                subVariant="verySmall"
                className="mx-1"
                onClick={applyButtonClickHandler}
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
      </div>
    );
  };
}
