import {CONST_FUNCTIONS} from '@/utils/common/constants';
import {withPageFacets} from '../Common/Facets/HOC/withPageFacets';
import {FunctionPageFacetsContext} from '../ContextProviders/FunctionPageFacetsContext';
const FunctionFacets = withPageFacets(
  CONST_FUNCTIONS,
  FunctionPageFacetsContext
);
export default FunctionFacets;
