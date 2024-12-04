import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {
  makeUrlVariables,
  processOutput,
  facetStateToPayload
} from '@/genericApi/helper';
import {FacetPayload} from '@/utils/common/commonTypes';
import {FACET_KEY_TYPE, REPOSITORIES} from '@/utils/common/constants';

function denormalizeMembersFeedOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res.data?.results) {
    if (res.data.results.length) {
      return {
        [REPOSITORIES.GROUPS_REPOSITORY]: {
          groups: res.data.results.reduce((acc: any, obj: any) => {
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

export function createGetGroupsPageFeeds() {
  return function getMembersPageFeeds({
    facetState,
    page,
    userId
  }: FacetPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE])
    });

    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/groups${query}`
    );
    requestObj.processOutput = denormalizeMembersFeedOutput;
    return requestObj;
  };
}

export function createPostJoinGroup() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.GROUPS_REPOSITORY]: {
          groups: {
            [this.payload?.groupId]: {
              isJoined: true
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, groupId} = makeUrlVariables(
      ['userId', 'groupId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/groups/${groupId}/join`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostRequestInviteGroup() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.GROUPS_REPOSITORY]: {
          groups: {
            [this.payload?.groupId]: {
              isInviteRequested: true
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, groupId} = makeUrlVariables(
      ['userId', 'groupId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/groups/${groupId}/request-invite`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

function denormalizeGetGroupDetailsOutput(this: RequestObject, response: any) {
  const res = processOutput(response);
  if (!res?.errorCode) {
    return {
      [REPOSITORIES.GROUPS_REPOSITORY]: {
        groupDetails: {
          [this?.payload?.groupId]: res?.data
        }
      }
    };
  }
  return res;
}
export function createGetGroupDetails() {
  return function getGroupDetails({
    userId,
    groupId
  }: {
    userId: number;
    groupId: string;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/groups/${groupId}`
    );
    requestObj.processOutput = denormalizeGetGroupDetailsOutput;
    return requestObj;
  };
}
