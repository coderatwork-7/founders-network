import {withPageFacets} from '@/components/Common/Facets/HOC/withPageFacets';
import {CONST_PARTNERS} from '@/utils/common/constants';
import {PartnersPageFacetsContext} from '../ContextProviders/PartnersFacetsContext';

const PartnersFacets = withPageFacets(
  CONST_PARTNERS,
  PartnersPageFacetsContext
);
export default PartnersFacets;
