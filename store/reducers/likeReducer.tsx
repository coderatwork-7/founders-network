import {createAction, createReducer} from '@reduxjs/toolkit';
import {ForumCardResponse} from '@/components/Cards/Forum/forumCard';
import {CONST_FORUMS} from '@/utils/common/constants';
import {FEEDS} from '@/utils/common/commonTypes';
interface ToggleLikePayload {
  feedId: string;
  authorName: string;
  authorProfileId: number;
}
interface ToggleCommentLikePayload extends ToggleLikePayload {
  commentId: number;
}
interface ToggleFeedsLikePayload extends ToggleLikePayload {
  feedsType: FEEDS;
}

export const toggleLikeOnComment =
  createAction<ToggleCommentLikePayload>('toggleCommentLike');

export const toggleFeedsLike =
  createAction<ToggleFeedsLikePayload>('toggleFeedsLike');

export const toggleLikeReducer = createReducer({}, builder => {
  builder.addCase(
    toggleLikeOnComment.type,
    (state: any, action: any): {forums: {[id: string]: ForumCardResponse}} => {
      const payload: ToggleCommentLikePayload = action.payload;
      const forumPost: ForumCardResponse = state[CONST_FORUMS][payload.feedId];
      const comments = forumPost.comments!;
      const commentIndex = comments.findIndex(
        comment => `${comment.id}` === `${payload.commentId}`
      );
      const prevAffectedCommentLike = comments[commentIndex].like;
      const newComments = comments.slice();
      if (prevAffectedCommentLike?.liked) {
        newComments[commentIndex] = {
          ...comments[commentIndex],
          like: {
            liked: false,
            count: prevAffectedCommentLike.count - 1,
            profile: prevAffectedCommentLike.profile.filter(
              profile => `${profile.id}` !== `${payload.authorProfileId}`
            )
          }
        };
      } else {
        newComments[commentIndex] = {
          ...comments[commentIndex],
          like: {
            liked: true,
            count: prevAffectedCommentLike.count + 1,
            profile: [
              {id: payload.authorProfileId, name: payload.authorName},
              ...prevAffectedCommentLike.profile
            ]
          }
        };
      }
      return {
        ...state,
        [CONST_FORUMS]: {
          ...state[CONST_FORUMS],
          [payload.feedId]: {
            ...forumPost,
            comments: newComments
          }
        }
      };
    }
  );
  builder.addCase(toggleFeedsLike.type, (state: any, action: any) => {
    const {
      authorName,
      authorProfileId,
      feedId,
      feedsType
    }: ToggleFeedsLikePayload = action.payload;
    const feedPost: ForumCardResponse = state[feedsType][feedId];
    const affectedLikePrevState = feedPost.like!;
    let newLikeObj = {};
    if (affectedLikePrevState?.liked) {
      newLikeObj = {
        count: affectedLikePrevState.count - 1,
        liked: false,
        profile: affectedLikePrevState.profile.filter(
          profile => `${profile.id}` !== `${authorProfileId}`
        )
      };
    } else {
      newLikeObj = {
        count: affectedLikePrevState.count + 1,
        liked: true,
        profile: [
          {id: authorProfileId, name: authorName},
          ...affectedLikePrevState.profile
        ]
      };
    }
    return {
      ...state,
      [feedsType]: {
        ...state[feedsType],
        [feedId]: {
          ...feedPost,
          like: newLikeObj
        }
      }
    };
  });
});
