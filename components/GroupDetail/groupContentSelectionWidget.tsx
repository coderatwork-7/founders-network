import clsx from 'clsx';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo
} from 'react';
import classes from './groupContentSelectionWidget.module.scss';
import {GroupDetails} from '@/pages/group/[groupId]';
import {GroupsDetailForumsFacetsContext} from '../ContextProviders/GroupsDetailForumsFacetsContext';
import {GroupsDetailFunctionsFacetsContext} from '../ContextProviders/GroupsDetailFunctionsFacetsContext';
import {GroupsDetailMembersFacetsContext} from '../ContextProviders/GroupsDetailMembersFacetsContext';
import {
  CONST_FORUMS,
  CONST_FUNCTIONS,
  CONST_MEMBERS,
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB
} from '@/utils/common/constants';
interface GroupContentSelectionWidgetProps {
  setSelectedTab: Dispatch<SetStateAction<number>>;
  groupDetail: GroupDetails;
  selectedTab: number;
}
export function GroupContentSelectionWidget({
  selectedTab,
  setSelectedTab,
  groupDetail
}: GroupContentSelectionWidgetProps) {
  const {setSelectedFacetValues: setForums, setApplyFacets: applyForums} =
    useContext(GroupsDetailForumsFacetsContext);
  const {setSelectedFacetValues: setFunctions, setApplyFacets: applyFunctions} =
    useContext(GroupsDetailFunctionsFacetsContext);
  const {setSelectedFacetValues: setMembers, setApplyFacets: applyMembers} =
    useContext(GroupsDetailMembersFacetsContext);

  const applyMap = useMemo(
    () => [applyForums, applyFunctions, applyMembers],
    []
  );
  const setMap = useMemo(() => [setForums, setFunctions, setMembers], []);
  const activeTabMap = useMemo(
    () => [CONST_FORUMS, CONST_FUNCTIONS, CONST_MEMBERS],
    []
  );
  const onClick = useCallback(
    (tab: number) => () => {
      setMap[tab](prev => ({
        [GROUP_ACTIVE_TAB]: {
          [activeTabMap[tab]]: {
            facetValueKey: activeTabMap[tab],
            facetValueName: activeTabMap[tab]
          }
        },
        groupId: prev?.groupId,
        [FACET_KEY_TYPE]: prev?.[FACET_KEY_TYPE],
        ...(tab == 1 && {
          sort: {
            upcoming: {facetValueKey: 'upcoming', facetValueName: 'upcoming'}
          }
        })
      }));
      applyMap?.[tab]?.(true);
      setSelectedTab(tab);
    },
    []
  );
  const classSelect = useCallback(
    (tab: number) => (selectedTab === tab ? classes.selected : false),
    [selectedTab]
  );
  return (
    <div className={clsx(classes.container, 'w-100')}>
      <div className={clsx(classes.posts, classSelect(0))} onClick={onClick(0)}>
        POSTS
      </div>
      <div
        className={clsx(classes.functions, classSelect(1))}
        onClick={onClick(1)}
      >
        FUNCTIONS
      </div>
      <div
        className={clsx(classes.members, classSelect(2))}
        onClick={onClick(2)}
      >
        MEMBERS {`(${groupDetail?.count})`}
      </div>
    </div>
  );
}
