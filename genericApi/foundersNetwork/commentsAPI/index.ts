import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {FEEDS_TYPE, REPOSITORIES} from '@/utils/common/constants';
import {createAPI} from '../apiEndpoints';
import {AxiosResponse} from 'axios';
import {selectForumPost} from '@/store/selectors';
import {removePrefixFromId} from '@/utils/common/helper';

interface GetForumCommentsPayload {
  url: {
    forumId: string | number;
    page?: number | string;
  };
  [key: string]: any;
}

interface PostForumCommentPayload {
  forumId: string;
}
function denormalizeForumCommentsOutput(
  this: RequestObject,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  const forumComments =
    state[REPOSITORIES.FEEDS_REPOSITORY]?.forums?.[this.payload?.forumId]
      ?.comments || [];
  const present = forumComments.reduce(
    (acc: {[key: string]: boolean}, element: any) => {
      acc[element.id] = true;
      return acc;
    },
    {}
  );
  if (res && res.data) {
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this.payload?.forumId]: {
            comments: [
              ...forumComments,
              ...res.data.results
                .map((obj: any) => {
                  if (obj.muteThread !== false && !obj.muteThread)
                    obj.muteThread = false;
                  if (obj.followThread !== false && !obj.followThread)
                    obj.followThread = false;
                  return obj;
                })
                .filter((element: any) => !present[element.id])
            ]
          }
        }
      },
      data: res.data
    };
  }

  return res;
}
export function createGetForumComments() {
  return function getForumComments(payload: GetForumCommentsPayload) {
    const {forumId, query} = makeUrlVariables(['forumId'], ['page'], payload);
    const requestObj = createAPI(false)(
      `/v1/api/feeds/forums/${removePrefixFromId(
        forumId,
        FEEDS_TYPE.FORUMS
      )}/comments${query}`
    );
    requestObj.processOutput = denormalizeForumCommentsOutput;
    return requestObj;
  };
}

function denormalizePostForumCommentOutput(
  this: RequestObject,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    const forumData = selectForumPost(this?.payload?.forumId)(state);
    const isPrivateReply = this?.options?.data?.type === 'reply';
    const forumComments = forumData?.comments || [];
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this.payload?.forumId]: {
            ...(!isPrivateReply && {comments: [res.data, ...forumComments]}),
            analytics: {
              comment: (forumData?.analytics?.comment ?? 0) + +!isPrivateReply,
              privateComment:
                (forumData?.analytics?.privateComment ?? 0) + +isPrivateReply
            }
          }
        }
      },
      data: res.data
    };
  }
  return res;
}
export function createPostForumComment() {
  return function postForumComment(payload: PostForumCommentPayload) {
    const {forumId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/feeds/forums/${removePrefixFromId(
        forumId.toString(),
        FEEDS_TYPE.FORUMS
      )}/comments`
    );
    requestObj.processOutput = denormalizePostForumCommentOutput;
    return requestObj;
  };
}

interface EditCommentPayload {
  commentId: number;
}
function denormalizePutEditCommentOutput(
  this: RequestObject,
  response: AxiosResponse,
  state: any
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    const forumPost = selectForumPost(this?.payload?.forumId)(state);
    const commentsCopy = forumPost?.comments?.slice();
    const affectedIndex = commentsCopy?.findIndex(
      comment => `${comment.id}` === `${this?.payload?.commentId}`
    );
    // eslint-disable-next-line
    commentsCopy![affectedIndex ?? 0] = {
      // eslint-disable-next-line
      ...commentsCopy![affectedIndex ?? 0],
      content: this.options?.data?.content
    };
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            comments: commentsCopy
          }
        }
      }
    };
  }
  return res;
}
export function createPutEditComment() {
  return function putEditComment(payload: EditCommentPayload) {
    const {commentId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/feeds/forums/${commentId}/comments`
    );
    requestObj.processOutput = denormalizePutEditCommentOutput;
    return requestObj;
  };
}

function denormalizeDeleteCommentOutput(
  this: RequestObject,
  response: AxiosResponse,
  state: any
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    const forumPost = selectForumPost(this?.payload?.forumId)(state);
    const commentsCopy = forumPost?.comments?.slice();
    const affectedIndex = commentsCopy?.findIndex(
      comment => `${comment.id}` === `${this?.payload?.commentId}`
    );
    commentsCopy?.splice(affectedIndex ?? 0, 1);
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            comments: commentsCopy,
            analytics: {
              comment: (forumPost?.analytics?.comment ?? 1) - 1,
              privateComment: forumPost?.analytics?.privateComment
            }
          }
        }
      }
    };
  }
  return res;
}
export function createDeleteComment() {
  return function deleteComment(payload: EditCommentPayload) {
    const {commentId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/feeds/forums/${commentId}/comments`
    );
    requestObj.processOutput = denormalizeDeleteCommentOutput;
    return requestObj;
  };
}
function denormalizePutFollowMuteOutput(
  this: RequestObject,
  response: AxiosResponse,
  state: any
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    const forumPost = selectForumPost(this?.payload?.forumId)(state);
    const commentsCopy = forumPost?.comments?.slice();
    const affectedIndex = commentsCopy?.findIndex(
      comment => `${comment.id}` === `${this?.payload?.commentId}`
    );
    // eslint-disable-next-line
    const newCommentObj = {...commentsCopy![affectedIndex ?? 0]};

    if (this.payload?.flag === 'follow') {
      newCommentObj.followThread = this.options?.data?.follow;
    } else {
      // eslint-disable-next-line
      newCommentObj.muteThread = !commentsCopy![affectedIndex ?? 0].muteThread;
    }
    // eslint-disable-next-line
    commentsCopy![affectedIndex ?? 0] = newCommentObj;
    return {
      [REPOSITORIES.FEEDS_REPOSITORY]: {
        forums: {
          [this?.payload?.forumId]: {
            comments: commentsCopy
          }
        }
      }
    };
  }
  return res;
}

export interface PutFollowMutePayload {
  userId: number;
  commentId: number;
  forumId: string;
  flag: 'follow' | 'mute' | 'unmute';
}
export function createPutFollowMute() {
  return function putFollowMute(payload: PutFollowMutePayload) {
    const {commentId, flag, forumId, userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/forums/${forumId.slice(
        3
      )}/comments/${commentId}/${flag}`
    );
    requestObj.processOutput = denormalizePutFollowMuteOutput;
    return requestObj;
  };
}
