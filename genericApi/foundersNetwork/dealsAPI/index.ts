import {
  facetStateToPayload,
  makeUrlVariables,
  processOutput
} from '@/genericApi/helper';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {FACET_KEY_TYPE, REPOSITORIES} from '@/utils/common/constants';
import {FacetPayload} from '@/utils/common/commonTypes';
import {NoDataFoundError} from '@/genericApi/errors';
import {convertObjectUsingMapping} from '@/utils/common/helper';
import {
  DEALS_PAGE_MAP,
  DEALS_MODAL_INFO_MAP
} from '@/utils/common/apiToStoreMaps';

export type DealType = {
  id: string;
  title: string;
  image: string;
  company: {
    name: string;
    description: string;
  };
  value: number;
  isRedeemed: boolean;
};

export function createGetDealInfo() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.DEALS_REPOSITORY]: {
          deals: {
            [this.payload?.dealId]: convertObjectUsingMapping(
              res.data,
              DEALS_MODAL_INFO_MAP
            )
          }
        },
        data: res.data
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, dealId} = makeUrlVariables(
      ['userId', 'dealId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/deals/${dealId}`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostRateDeal() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const {
        rating: userRating,
        improve,
        improveComment: improveText
      } = this.options?.data ?? {};

      return {
        [REPOSITORIES.DEALS_REPOSITORY]: {
          deals: {
            [this.payload?.dealId]: {
              ...(userRating && {userRating}),
              ...(improve && {improve}),
              ...(improveText && {improveText})
            }
          }
        },
        data: res.data
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, dealId} = makeUrlVariables(
      ['userId', 'dealId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/deals/${dealId}/rate`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostRedeemDeal() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.DEALS_REPOSITORY]: {
          deals: {
            [this.payload?.dealId]: {
              isRedeemed: true
            }
          }
        },
        data: res.data
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, dealId} = makeUrlVariables(
      ['userId', 'dealId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/deals/${dealId}/redeem`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function denormalizeGetDealsOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res?.data) {
    return {
      [REPOSITORIES.DEALS_REPOSITORY]: {
        deals: Object.values(res.data).reduce((acc: any, dealArray: any) => {
          if (Array.isArray(dealArray))
            dealArray.forEach((dealObj: any) =>
              Object.assign(acc, {
                [dealObj.id]: convertObjectUsingMapping(dealObj, DEALS_PAGE_MAP)
              })
            );
          else acc.info = dealArray;
          return acc;
        }, {})
      },
      data: {
        next: null,
        previous: null,
        count: null,
        data: Object.entries(res.data).reduce(
          (acc: any, [level, array]) =>
            Object.assign(acc, {
              [level]: Array.isArray(array)
                ? (array as any[]).map(obj => obj.id)
                : array
            }),
          {}
        )
      }
    };
  }
  return res;
}
export function createGetDeals() {
  return function getDeals({userId, facetState}: FacetPayload) {
    const {query} = makeUrlVariables(
      [],
      Object.keys(facetState),
      facetStateToPayload(facetState, [FACET_KEY_TYPE])
    );

    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/deals${query}`
    );
    requestObj.processOutput = denormalizeGetDealsOutput;
    return requestObj;
  };
}

export function createDealsListingFee() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.DEALS_REPOSITORY]: {
          dealListingFee: res?.data
        }
      };
    }
  }

  return function getDealsListingFee({userId}: {userId: number}) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/deals/listing-fee`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createAddDeal() {
  return function postDealForm({userId}: {userId: number}) {
    return createAPI(false)(`/v1/api/users/${userId}/deal`);
  };
}

export function createDealTags() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.DEALS_REPOSITORY]: {
          dealTags: [...res.data]
        }
      };
    }
  }
  return function getAllDealTags({userId}: {userId: number}) {
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/deals/tags`);
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
