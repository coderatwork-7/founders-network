import {CONST_OPPORTUNITIES} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {InvestorLoginFacetsContext} from '../ContextProviders/InvestorLoginFacetsContext';

export const InvestorLoginFacets = withPageFacets(
  CONST_OPPORTUNITIES,
  InvestorLoginFacetsContext
);
