import {withPageFacets} from '@/components/Common/Facets/HOC/withPageFacets';
import {CONST_MEMBERS} from '@/utils/common/constants';
import {MembersPageFacetsContext} from '../ContextProviders/MembersFacetsContext';

const MembersFacets = withPageFacets(CONST_MEMBERS, MembersPageFacetsContext);
export default MembersFacets;
