import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {
  makeUrlVariables,
  processOutput,
  facetStateToPayload
} from '@/genericApi/helper';
import {FacetPayload, FacetState} from '@/utils/common/commonTypes';
import {
  FACET_KEY_TYPE,
  GROUP_ACTIVE_TAB,
  REPOSITORIES
} from '@/utils/common/constants';
import {AxiosResponse} from 'axios';

function denormalizeGetMembersObjectives(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    const facetState = Object.assign(
      {},
      res.data.reduce(
        (acc: FacetState, objectiveObj: any, index: number) =>
          Object.assign(acc, {
            [index]: (objectiveObj.tags as any[]).reduce(
              (acc, tagObj) =>
                Object.assign(acc, {
                  [tagObj.key]: {
                    facetValueKey: tagObj.key,
                    facetValueName: tagObj.name
                  }
                }),
              {
                objectiveFacet: {
                  facetValueKey: objectiveObj.key,
                  facetValueName: objectiveObj.objective
                }
              }
            )
          }),
        {}
      )
    );
    return {
      [REPOSITORIES.USER_REPOSITORY]: {
        objectives: {
          facetState,
          replaceReduxState: true
        }
      },
      data: facetState
    };
  }
  return res;
}
export function createGetMembersObjectives() {
  return function getMembersObjectives(payload: {userId: number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/objectives`);
    requestObj.processOutput = denormalizeGetMembersObjectives;
    return requestObj;
  };
}

function denormalizeGetAllMembers(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    return {
      [REPOSITORIES.MEMBERS_REPOSITORY]: {
        allMembers: {
          data: res.data
        }
      }
    };
  }
  return res;
}
export function createGetAllMembers() {
  return function getAllMembers(payload: {userId: number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/objectives/all-members`
    );
    requestObj.processOutput = denormalizeGetAllMembers;
    return requestObj;
  };
}

function denormalizeGetMemberExpertise(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    return {
      [REPOSITORIES.USER_REPOSITORY]: {
        expertise: {
          data: res.data
        }
      },
      data: res.data
    };
  }
  return res;
}

export function createGetMemberExpertise() {
  return function getMemberExpertise(payload: {userId: number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/expertise`);
    requestObj.processOutput = denormalizeGetMemberExpertise;
    return requestObj;
  };
}
function denormalizeMembersFeedOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res.data && res.data.results) {
    if (res.data.results.length) {
      return {
        [REPOSITORIES.MEMBERS_REPOSITORY]: {
          posts: res.data.results.reduce((acc: any, obj: any) => {
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

export function createGetMembersPageFeeds() {
  return function getMembersPageFeeds({
    facetState,
    page,
    userId
  }: FacetPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE, GROUP_ACTIVE_TAB])
    });

    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/members${query}`
    );
    requestObj.processOutput = denormalizeMembersFeedOutput;
    return requestObj;
  };
}

export function createPutObjectives() {
  return function putObjectives({userId}: {userId: number}) {
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/objectives`);
    requestObj.processOutput = denormalizeGetMembersObjectives;
    return requestObj;
  };
}
