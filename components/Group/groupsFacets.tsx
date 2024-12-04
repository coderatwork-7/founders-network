import {withPageFacets} from '@/components/Common/Facets/HOC/withPageFacets';
import {CONST_GROUPS} from '@/utils/common/constants';
import {GroupsPageFacetsContext} from '../ContextProviders/GroupsFacetsContext';

const GroupsFacets = withPageFacets(CONST_GROUPS, GroupsPageFacetsContext);
export default GroupsFacets;
