import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {
  makeUrlVariables,
  processOutput,
  facetStateToPayload
} from '@/genericApi/helper';
import {FacetPayload} from '@/utils/common/commonTypes';
import {
  FACET_KEY_TYPE,
  FEEDS_TYPE,
  GROUP_ACTIVE_TAB,
  REPOSITORIES
} from '@/utils/common/constants';
import {processAuthorAndLike, processForums} from '../feedsAPI';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {prefixIdByType, removePrefixFromId} from '@/utils/common/helper';

function denormalizeGetForumFeedsOutput(this: any, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res && res.data && res.data.results) {
    res.data.results.forEach((obj: any) => {
      obj.id = `fr_${obj.id}`;
      processAuthorAndLike(obj);
      processForums(obj);
    });

    if (res.data.results.length) {
      return {
        [REPOSITORIES.FEEDS_REPOSITORY]: {
          forums: res.data.results.reduce(
            (acc: any, obj: any) => Object.assign(acc, {[obj.id]: obj}),
            {}
          )
        },
        data: {
          next: res.data.next,
          previous: res.data.previous,
          count: res.data.count,
          data: res.data.results.map((obj: any) => obj.id)
        }
      };
    } else throw new NoDataFoundError('No incoming data');
  }

  return res;
}

function denormalizeForumsOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (res.data.length) {
      return {
        [REPOSITORIES.FEEDS_REPOSITORY]: {
          info: {
            [this.additionalParameter?.key || 'data']: res.data.reduce(
              (acc: any, obj: any) => {
                const key = `${obj.id}`;
                return {...acc, [key]: obj};
              },
              {}
            )
          }
        }
      };
    } else {
      throw new NoDataFoundError('No incoming data');
    }
  }

  return res;
}

export function createGetForumMembers() {
  return function getForumMembers() {
    const requestObj = createAPI(false)(`/v1/api/forum/members`);
    requestObj.additionalParameter = {key: 'members'};
    requestObj.processOutput = denormalizeForumsOutput;
    return requestObj;
  };
}

export function createGetForumTags() {
  return function getForumTags() {
    const requestObj = createAPI(false)(`/v1/api/forum/tags/`);
    requestObj.additionalParameter = {key: 'tags'};
    requestObj.processOutput = denormalizeForumsOutput;
    return requestObj;
  };
}

export function createGetForumPosts() {
  return function getForumPosts({page, userId, facetState}: FacetPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE, GROUP_ACTIVE_TAB])
    });
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/forums${query}`
    );
    requestObj.processOutput = denormalizeGetForumFeedsOutput;
    return requestObj;
  };
}

export function createGetForumDetail() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const forumId = prefixIdByType(this?.payload?.forumId, FEEDS_TYPE.FORUMS);

      return {
        [REPOSITORIES.FEEDS_REPOSITORY]: {
          forums: {
            [forumId]: {
              ...res?.data,
              id: forumId
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {threadId} = makeUrlVariables(['userId', 'threadId'], [], payload);
    const requestObj = createAPI(false)(
      `/v1/api/feeds/forums/${threadId}/analytics`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostCreateForumPost() {
  return function () {
    return createAPI(false)(`/v1/api/feeds/forum`);
  };
}

export function createGetSuggestedPosts() {
  return function (payload: InvokeApiClientSidePayload) {
    const {userId, threadId, query} = makeUrlVariables(
      ['userId', 'threadId'],
      ['limit'],
      payload
    );
    return createAPI(false)(
      `/v1/api/users/${userId}/forum/${threadId}/suggested-post${query}`
    );
  };
}

export function createPostRemoveSuggestedPosts() {
  return function (payload: InvokeApiClientSidePayload) {
    const {userId, threadId, threadToClose} = makeUrlVariables(
      ['userId', 'threadId', 'threadToClose'],
      [],
      payload
    );
    return createAPI(false)(
      `/v1/api/users/${userId}/forum/${threadId}/suggested-close/${threadToClose}`
    );
  };
}

function denormalizePostEditForumPost(this: RequestObject, response: any) {
  const res = processOutput(response);
  if (!res?.errorCode) {
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            id: `fr_${res?.data?.id}`,
            detail: res?.data?.details,
            title: res?.data?.title
          }
        }
      }
    };
  }
  return res;
}
export function createPostEditForumPost() {
  return function postEditForumPost({
    threadId,
    userId
  }: {
    threadId: string;
    userId: number;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/forums/${threadId}`
    );
    requestObj.processOutput = denormalizePostEditForumPost;
    return requestObj;
  };
}
function denormalizePostFollowPost(this: RequestObject, response: any) {
  const res = processOutput(response);
  if (!res?.errorCode) {
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            followThread: this?.options?.data?.data?.follow
          }
        }
      }
    };
  }
  return res;
}

export function createPostFollowPost() {
  return function postFollowPost({
    forumId,
    userId
  }: {
    userId: string;
    forumId: string;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/forums/${removePrefixFromId(
        forumId,
        FEEDS_TYPE.FORUMS
      )}/follow`
    );
    requestObj.processOutput = denormalizePostFollowPost;
    return requestObj;
  };
}
function denormalizePutMuteForumPost(this: RequestObject, response: any) {
  const res = processOutput(response);
  if (!res?.errorCode) {
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            muteThread: this?.payload?.mute
          }
        }
      }
    };
  }
  return res;
}

export function createPutMuteForumPost() {
  return function putMuteForumPost({
    forumId,
    userId,
    mute
  }: {
    userId: string;
    forumId: string;
    mute: boolean;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/forums/${removePrefixFromId(
        forumId,
        FEEDS_TYPE.FORUMS
      )}/${mute ? 'mute' : 'unmute'}`
    );
    requestObj.processOutput = denormalizePutMuteForumPost;
    return requestObj;
  };
}
export function createDeleteForumPost() {
  return function deleteForumPost({
    forumId,
    userId
  }: {
    userId: string;
    forumId: string;
  }) {
    return createAPI(false)(
      `/v1/api/users/${userId}/forums/${removePrefixFromId(
        forumId,
        FEEDS_TYPE.FORUMS
      )}`
    );
  };
}
