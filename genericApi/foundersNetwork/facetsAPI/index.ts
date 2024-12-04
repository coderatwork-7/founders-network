import {processOutput} from '@/genericApi/helper';
import {REPOSITORIES} from '@/utils/common/constants';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';
interface FacetsPayloadType {
  page: string;
  userId: string;
}

function denormalizeFacetsOutput(this: any, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res && res.data) {
    if (res.data.length)
      return {
        [REPOSITORIES.FACETS_REPOSITORY]: {
          [this.payload.page]: {
            facets: res.data
          }
        }
      };
    else throw new NoDataFoundError('No data found');
  }
  return res;
}

export function createGetFacets() {
  return function getFacets(payload: FacetsPayloadType) {
    const {page, userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/${page}/facets`
    );
    requestObj.processOutput = denormalizeFacetsOutput;
    return requestObj;
  };
}
