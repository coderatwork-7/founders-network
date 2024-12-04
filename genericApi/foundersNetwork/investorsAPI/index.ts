import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {AxiosResponse} from 'axios';
import {FACET_KEY_TYPE, REPOSITORIES} from '@/utils/common/constants';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {
  makeUrlVariables,
  processOutput,
  facetStateToPayload
} from '@/genericApi/helper';
import {FacetPayload} from '@/utils/common/commonTypes';
import {convertObjectUsingMapping} from '@/utils/common/helper';
import {INVESTOR_FUNDRAISING_FORM_INFO_MAP} from '@/utils/common/apiToStoreMaps';
import {selectRemainingIntrosInfo} from '@/store/selectors';
const NO_DATA_FOUND = 'No data found';

function denormalizeGetIntroFormInfo(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);

  if (!res.errorCode) {
    return {
      [REPOSITORIES.INVESTORS_REPOSITORY]: {
        details: {
          [this?.payload?.infoType]: res?.data?.map((element: any) => ({
            id: element?.id ?? element?.name,
            name: element?.name ?? element?.id
          }))
        }
      }
    };
  }
  return res;
}
export function createGetIntroFormInfo() {
  return function getIntroFormInfo({
    userId,
    infoType
  }: {
    userId: number;
    infoType: string;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/investor/${infoType}`
    );
    requestObj.processOutput = denormalizeGetIntroFormInfo;
    return requestObj;
  };
}
function denormalizeGetIntroUserDetails(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    return {
      [REPOSITORIES.INVESTORS_REPOSITORY]: {
        userInfo: {
          details: res?.data
        }
      }
    };
  }
  return res;
}

export function createGetIntroUserDetails() {
  return function getIntroUserDetails({
    investorId,
    userId
  }: {
    userId: number;
    investorId: number;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/investor/${investorId}/request-intro`
    );
    requestObj.processOutput = denormalizeGetIntroUserDetails;
    return requestObj;
  };
}

function denormalizePostIntroUserDetails(
  this: RequestObject,
  response: AxiosResponse,
  state: any
) {
  const res = processOutput(response);
  const newCount = selectRemainingIntrosInfo()(state) - 1;
  if (!res.errorCode) {
    return {
      [REPOSITORIES.INVESTORS_REPOSITORY]: {
        userInfo: {
          details: res?.data
        }
      },
      [REPOSITORIES.USER_REPOSITORY]: {
        details: {
          info: {
            remainingIntroRequests: newCount
          }
        }
      }
    };
  }
  return res;
}

export function createPostIntroUserDetails() {
  return function postIntroUserDetails({
    investorId,
    userId
  }: {
    userId: number;
    investorId: number;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/investor/${investorId}/request-intro`
    );
    requestObj.processOutput = denormalizePostIntroUserDetails;
    return requestObj;
  };
}

export function createInvestmentSettingsAPI() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.INVESTORS_REPOSITORY]: {
          info: {
            investmentSettings: res.data
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return function ({userId}: {userId: string}) {
    const requestObj = createAPI(false)(
      `v1/api/users/${userId}/investment-settings`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

function denormalizeInvestorsFeedOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res.data?.results) {
    if (res.data.results.length) {
      return {
        [REPOSITORIES.INVESTORS_REPOSITORY]: {
          investors: res.data.results.reduce((acc: any, obj: any) => {
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

export function createGetInvestorsPageFeeds() {
  return function getInvestorsPageFeeds({
    facetState,
    page,
    userId
  }: FacetPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE])
    });

    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/investors${query}`
    );
    requestObj.processOutput = denormalizeInvestorsFeedOutput;
    return requestObj;
  };
}

export function createInvestorOverview() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res?.data) {
      return {
        [REPOSITORIES.INVESTORS_REPOSITORY]: {
          investors: {
            [this?.payload?.investorId]: {
              ...res.data
            }
          }
        }
      };
    }
  }

  return function ({userId, investorId}: {userId: number; investorId: number}) {
    const requestObj = createAPI(false)(
      `v1/api/users/${userId}/investors/${investorId}`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createGetIntroRequestsCount() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            info: {
              remainingIntroRequests: res.data.count
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return function ({userId}: {userId: string}) {
    const requestObj = createAPI(false)(
      `v1/users/${userId}/remaining-intro-request`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createFundraisingInfoAPI() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.INVESTORS_REPOSITORY]: {
          userInfo: {
            details: convertObjectUsingMapping(
              res.data,
              INVESTOR_FUNDRAISING_FORM_INFO_MAP
            )
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return function ({userId}: {userId: string}) {
    const requestObj = createAPI(false)(
      `v1/api/users/${userId}/fundraising-email`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createInvestorDetails() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    if (this?.payload?.type == 'opportunities') {
      const arrayObj: any = {};
      res?.data?.results?.forEach((ele: any) => {
        arrayObj[ele?.id] = ele;
      });

      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          [this?.payload?.type]: {
            ...arrayObj
          }
        },
        data: {
          next: res.data.next,
          previous: res.data.previous,
          count: res.data.count,
          data: res?.data?.results?.map((item: any) => item?.id)
        }
      };
    } else if (res?.data) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          [this?.payload?.type]: {
            ...res?.data
          }
        }
      };
    }
  }

  return function ({
    userId,
    type,
    facetState,
    page
  }: {type: string} & FacetPayload) {
    const {query} = makeUrlVariables(
      [],
      ['page', ...Object.keys(facetState ?? {})],
      {
        page,
        ...facetStateToPayload(facetState, [FACET_KEY_TYPE])
      }
    );
    const requestObj = createAPI(false)(
      `v1/api/users/${userId}/${type}${type === 'opportunities' ? query : ''}`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
