import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {
  makeUrlVariables,
  processOutput,
  facetStateToPayload
} from '@/genericApi/helper';
import {FacetPayload} from '@/utils/common/commonTypes';
import {FACET_KEY_TYPE, REPOSITORIES} from '@/utils/common/constants';

function denormalizePartnersFeedOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res.data && res.data.results) {
    if (res.data.results.length) {
      return {
        [REPOSITORIES.PARTNERS_REPOSITORY]: {
          partners: res.data.results.reduce((acc: any, obj: any) => {
            return Object.assign(acc, {[obj.id]: obj});
          }, {}),
          replaceReduxState: this.payload?.replaceReduxState
        },
        data: {
          next: res.data.next,
          data: res.data.results.map((obj: any) => obj.id)
        }
      };
    } else throw new NoDataFoundError('no data recieved');
  }
  return res;
}

export function createGetPartnersPageFeeds() {
  return function getPartnersPageFeeds({
    facetState,
    page,
    userId
  }: FacetPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE])
    });

    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/partners${query}`
    );
    requestObj.processOutput = denormalizePartnersFeedOutput;
    return requestObj;
  };
}
