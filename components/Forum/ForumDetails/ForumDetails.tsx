import React, {useEffect, useState} from 'react';
import classes from './ForumDetails.module.scss';
import {isObjectEmpty, prefixIdByType} from '@/utils/common/helper';
import {FEEDS_TYPE} from '@/utils/common/constants';
import clsx from 'clsx';
import ForumCard from '@/components/Cards/Forum/forumCard';
import useAPI from '@/utils/common/useAPI';
import {SuggestedPost} from '@/components/Cards/SuggestedPost/SuggestedPost';
import {Spinner} from '@/ds/Spinner';
import {useSelector} from 'react-redux';
import {
  selectApiState,
  selectForumPost,
  selectUserInfo
} from '@/store/selectors';
import {useRouter} from 'next/router';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';

export type SuggestedPostType = {
  id: string;
  threadId: string;
  url: string;
  title: string;
  appetizer: string;
  info?: string;
  author: {
    name: string;
    profileId: number;
    companyName: string;
    profileImage: string;
    badge?: string;
  };
  loading?: boolean;
};

interface ForumDetailsPropType {
  forumDetail: any;
}

export const ForumDetails: React.FC<ForumDetailsPropType> = ({forumDetail}) => {
  const api = useAPI();
  const id = forumDetail?.id;
  const {id: userId} = useSelector(selectUserInfo()) ?? {};
  const [suggestedPosts, setSuggestedPosts] = useState<
    Array<SuggestedPostType>
  >([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const data: any = useSelector(
    selectForumPost(prefixIdByType(id?.toString() ?? '', FEEDS_TYPE.FORUMS))
  );

  useEffect(() => {
    if (userId && id && isObjectEmpty(data)) {
      api('getForumDetails', {threadId: forumDetail?.threadId, forumId: id});
    }

    if (userId && id && suggestedPosts?.length === 0) {
      setSuggestionsLoading(true);
      api('getSuggestedPosts', {
        userId,
        threadId: forumDetail?.threadId,
        limit: 2,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      })
        .then(res => {
          setSuggestedPosts(
            res.data.map((post: SuggestedPostType, index: number) => ({
              ...post,
              threadId: `${index}_${post.threadId}`
            }))
          );
          setSuggestionsLoading(false);
        })
        .catch(() => setSuggestionsLoading(false));
    }
  }, [id, userId, forumDetail, data, suggestedPosts]);

  const removeSuggestedPost = (threadIdPrefixed: string) => {
    const [_, index, threadId] = RegExp(/^(\d+)_(\d+)$/).exec(
      threadIdPrefixed
    ) ?? [0, 0, 0];
    if (index) {
      setSuggestedPosts(posts => {
        const updatedPosts = [...posts];
        updatedPosts[+index].loading = true;
        return updatedPosts;
      });
    }
    api(
      'postRemoveSuggestedPosts',
      {
        userId,
        threadId: forumDetail?.threadId,
        threadToClose: threadId
      },
      {
        method: 'POST',
        data: {
          ids: suggestedPosts.map(
            post => RegExp(/_(.+)/).exec(post.threadId)?.[1]
          )
        }
      }
    ).then(res => {
      setSuggestedPosts(posts => {
        const updatedPosts = [...posts];
        updatedPosts[+index] = {
          ...res.data,
          threadId: `${index}_${res.data.threadId}`
        };
        return updatedPosts;
      });
    });
  };
  return (
    <div
      className={clsx([classes.forumContent, !forumDetail && 'text-center'])}
    >
      {!forumDetail ? (
        <Spinner className="mt-5" />
      ) : (
        <>
          {forumDetail && (
            <ForumCard
              data={{
                ...forumDetail,
                ...data,
                id: prefixIdByType(forumDetail?.id, FEEDS_TYPE.FORUMS)
              }}
              expanded={true}
            />
          )}
          <div
            className={clsx([
              classes.footer,
              'newDesignBorder container-box-shadow'
            ])}
          >
            <div className={classes.suggestedText}>Suggested Posts</div>
            <div
              className={clsx([
                classes.suggestions,
                suggestionsLoading &&
                  'justify-content-center align-items-center'
              ])}
            >
              {suggestionsLoading ? (
                <Spinner />
              ) : (
                suggestedPosts.map(post => (
                  <SuggestedPost
                    key={post.threadId}
                    post={post}
                    removePost={removeSuggestedPost}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
