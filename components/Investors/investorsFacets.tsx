import {withPageFacets} from '@/components/Common/Facets/HOC/withPageFacets';
import {CONST_INVESTORS} from '@/utils/common/constants';
import {InvestorsPageFacetsContext} from '../ContextProviders/InvestorsFacetsContext';

const InvestorsFacets = withPageFacets(
  CONST_INVESTORS,
  InvestorsPageFacetsContext
);

export default InvestorsFacets;
