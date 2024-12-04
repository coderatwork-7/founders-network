import {CONST_FUNCTIONS} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {GroupsDetailFunctionsFacetsContext} from '../ContextProviders/GroupsDetailFunctionsFacetsContext';

export const GroupDetailFunctionsFacets = withPageFacets(
  CONST_FUNCTIONS,
  GroupsDetailFunctionsFacetsContext
);
