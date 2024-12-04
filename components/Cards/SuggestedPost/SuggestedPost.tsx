import React from 'react';
import classes from './SuggestedPost.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import ForumTitle from '../Forum/forumTitle';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {Spinner} from '@/ds/Spinner';
import {htmlToText, limitString} from '@/utils/common/helper';
import {SuggestedPostType} from '@/components/Forum/ForumDetails/ForumDetails';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';

interface SuggestedPostProps {
  post: SuggestedPostType;
  removePost: (id: string) => void;
}

interface AuthorProps {
  author: SuggestedPostType['author'];
}

export const SuggestedPost: React.FC<SuggestedPostProps> = ({
  post,
  removePost
}) => {
  const loading = useSelector(selectApiState('postRemoveSuggestedPosts'));
  return (
    <div
      className={clsx([classes.card, 'newDesignBorder container-box-shadow '])}
    >
      {!!post.loading && (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      )}
      <div className="d-flex justify-content-between">
        {/* TODO: Remove Fallback text after API correction*/}
        <div className={classes.info}>
          {post.info ?? 'Based on your History'}
        </div>
        <button
          type="button"
          className={clsx(['btn-close', classes.close])}
          onClick={() => {
            removePost(post.threadId);
          }}
          disabled={loading}
        ></button>
      </div>
      <Link href={`/forum/${post.threadId.split('_')[1]}`}>
        <h6 className={classes.title}>{limitString(post.title, 60)}</h6>
      </Link>
      <div className={classes.content}>{htmlToText(post.appetizer, 100)}</div>
      <AuthorInfo author={post.author} />
    </div>
  );
};

function AuthorInfo({author}: AuthorProps) {
  const {name, profileId, profileImage, companyName, badge} = author;
  return (
    <div className={clsx([classes.authorInfo, 'mt-auto'])}>
      <ProfileAvatarTooltip
        avatarUrl={profileImage ?? ''}
        id={profileId ?? 0}
        name={name ?? ''}
        badge={badge}
      />
      <div>
        <ForumTitle authorName={name ?? ''} profileId={profileId ?? 0} />
        <div className={classes.companyName}>{companyName}</div>
      </div>
    </div>
  );
}
