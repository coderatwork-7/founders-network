import {CONST_MEMBERS} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {GroupsDetailMembersFacetsContext} from '../ContextProviders/GroupsDetailMembersFacetsContext';

export const GroupDetailMembersFacets = withPageFacets(
  CONST_MEMBERS,
  GroupsDetailMembersFacetsContext
);
