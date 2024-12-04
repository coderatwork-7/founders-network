import classes from '@/ds/CommentsBox/components/commentsThreeDotMenu.module.scss';
import clsx from 'clsx';
import {ForumCardResponse, PostMute} from './forumCard';
import {Session} from 'next-auth';
import {ROLES} from '@/utils/common/constants';
import {Dispatch, SetStateAction, useState} from 'react';
interface ForumMenuOverlayProps {
  forumData: ForumCardResponse;
  userData: Session['user'];
  setEditingPost: Dispatch<SetStateAction<boolean>>;
  setEditData: Dispatch<SetStateAction<string>>;
  postFollow: (...all: any[]) => void;
  postMute: PostMute;
  postDelete: PostMute;
}
export default function ForumMenuOverlay({
  forumData,
  userData,
  setEditData,
  setEditingPost,
  postFollow,
  postMute,
  postDelete
}: ForumMenuOverlayProps) {
  const {role, profileId: loggedInUserProfileId} = userData;
  const {
    author: {profileId: postAuthorProfileId, name: postAuthorName},
    followThread: isFollowed,
    muteThread: isMute,
    detail: {content}
  } = forumData;
  const isUserAdmin = role === ROLES.ADMIN;
  const isPostAuthorOrAdmin =
    isUserAdmin || loggedInUserProfileId === postAuthorProfileId;
  const startEditing = () => {
    setEditingPost(true);
    setEditData(content);
  };
  const [loading, setLoading] = useState<
    'notLoading' | 'follow' | 'mute' | 'delete'
  >('notLoading');
  const chooseOnClick = (fn: any) =>
    loading === 'notLoading' ? fn : undefined;
  const isAuthorTheUser = loggedInUserProfileId === postAuthorProfileId;
  const followMenuOption = isFollowed ? (
    <div onClick={chooseOnClick(() => postFollow(false, setLoading))}>
      Unfollow {postAuthorName}'s post
    </div>
  ) : (
    <div onClick={chooseOnClick(() => postFollow(true, setLoading))}>
      Follow {postAuthorName}'s post
    </div>
  );

  const muteOnClick = chooseOnClick(() => postMute(setLoading));
  const muteMenuOption = isMute ? (
    <div onClick={muteOnClick}>Unmute this thread</div>
  ) : (
    <div onClick={muteOnClick}>Mute this thread</div>
  );
  return (
    <div
      className={clsx(
        classes.container,
        'cursorPointer',
        loading !== 'notLoading' && 'opacity-25'
      )}
    >
      {/* TODO: {isUserAdmin && <div>Forward</div>}
      {isUserAdmin && <div>Mark as Evergreen</div>} */}
      {isPostAuthorOrAdmin && (
        <div onClick={chooseOnClick(startEditing)}>Edit</div>
      )}
      {loading === 'delete' ? (
        <div>Deleting...</div>
      ) : (
        isPostAuthorOrAdmin && (
          <div onClick={chooseOnClick(() => postDelete(setLoading))}>
            Delete
          </div>
        )
      )}
      {!isAuthorTheUser && (
        <>
          {loading === 'follow' ? <div>Loading...</div> : followMenuOption}
          {loading === 'mute' ? <div>Loading...</div> : muteMenuOption}
        </>
      )}
    </div>
  );
}
