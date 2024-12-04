import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
type FeedsTypes =
  | 'ForumPost'
  | 'FnRsvp'
  | 'Nomination'
  | 'MemberToSubgroup'
  | 'DealRedemption';
interface FeedsLike {
  feedsType: FeedsTypes;
  id: string;
}
interface CommentLike extends FeedsLike {
  commentId: number | string;
}
type PostLikePayload = FeedsLike | CommentLike;

const tableNameMap = {
  ForumPost: 'forums',
  FnRsvp: 'function',
  Nomination: 'member',
  MemberToSubgroup: 'groups',
  DealRedemption: 'deals'
};
function denormalizeFeedsLikeOutput(this: any, response: any, state: any) {
  if (response instanceof Error) return response;
  return response;
}
function denormalizeCommentLikeOutput(this: any, response: any) {
  if (response instanceof Error) return response;
  return response;
}

export function createPostLike() {
  return function postLike(payload: PostLikePayload) {
    if ((payload as CommentLike).commentId === undefined) {
      const {feedsType, id} = payload as FeedsLike;
      const requestObj = createAPI(false)(
        `v1/api/feeds/${feedsType}/${id.slice(3)}/like`
      );
      requestObj.processOutput = denormalizeFeedsLikeOutput;
      return requestObj;
    } else {
      const {commentId, feedsType} = payload as CommentLike;
      const requestObj = createAPI(false)(
        `/v1/api/feeds/${feedsType}/${commentId}/like`
      );
      requestObj.processOutput = denormalizeCommentLikeOutput;
      return requestObj;
    }
  };
}
