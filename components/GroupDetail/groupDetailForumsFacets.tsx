import {CONST_FORUMS} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {GroupsDetailForumsFacetsContext} from '../ContextProviders/GroupsDetailForumsFacetsContext';

export const GroupDetailForumsFacets = withPageFacets(
  CONST_FORUMS,
  GroupsDetailForumsFacetsContext
);
