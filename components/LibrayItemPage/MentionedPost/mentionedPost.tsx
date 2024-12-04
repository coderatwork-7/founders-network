import React from 'react';
import classes from './mentionedPost.module.scss';
import Link from 'next/link';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import ForumTitle from '@/components/Cards/Forum/forumTitle';
import {HeartIcon} from '@/ds/Icons';
import useIsMobile from '@/utils/common/useIsMobile';

export type MentionedPostType = {
  id: number;
  postUrl: string;
  subtitle: string;
  category: string;
  date: string;
} & CardHeaderProps['author'];

interface MentionedPostProps {
  post: MentionedPostType;
}

interface CardHeaderProps {
  author: {
    profileId: number;
    avatarUrl: string;
    authorName: string;
    company: string;
  };
  date: string;
}

export const MentionedPost: React.FC<MentionedPostProps> = ({post}) => {
  return (
    <div className={classes.card}>
      <CardHeader author={post as CardHeaderProps['author']} date={post.date} />
      <Link href={`/forum/${post.id}`} className="flex-grow-1">
        <h6 className={classes.title}>{post.subtitle}</h6>
      </Link>
      {!!post.category && (
        <div className={classes.cardFooter}>
          <HeartIcon loading={false} isLiked={true} size="sm" />
          <div>{post.category}</div>
        </div>
      )}
    </div>
  );
};

function CardHeader({author, date}: Readonly<CardHeaderProps>) {
  const {profileId, avatarUrl, authorName, company} = author;
  const isMobile = useIsMobile();

  return (
    <div className={classes.cardHeader}>
      <ProfileAvatarTooltip
        avatarUrl={avatarUrl ?? ''}
        id={profileId ?? 0}
        name={authorName ?? ''}
        imageHeight={isMobile ? 60 : 70}
        imageWidth={isMobile ? 60 : 70}
      />
      <div>
        <ForumTitle authorName={authorName ?? ''} profileId={profileId ?? 0} />
        <div className={classes.subHeading}>{company}</div>
        <div className={classes.subHeading}>{date}</div>
      </div>
    </div>
  );
}
