import {withPageFacets} from '@/components/Common/Facets/HOC/withPageFacets';
import {CONST_DEALS} from '@/utils/common/constants';
import {DealsPageFacetsContext} from '../ContextProviders/DealsFacetsContext';

const DealsFacets = withPageFacets(CONST_DEALS, DealsPageFacetsContext);
export default DealsFacets;
