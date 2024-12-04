import {CONST_FORUMS} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {ForumFacetsContext} from '../ContextProviders/ForumFacetsContext';
const ForumFacets = withPageFacets(CONST_FORUMS, ForumFacetsContext);
export default ForumFacets;
