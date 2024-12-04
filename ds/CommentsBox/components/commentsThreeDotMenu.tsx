import {ROLES} from '@/utils/common/constants';
import classes from './commentsThreeDotMenu.module.scss';
import clsx from 'clsx';
import {OnMuteOrFollowFn} from './commentsCard';
import {useState} from 'react';

interface CommentsThreeDotMenuProps {
  commentAuthorProfileId: number;
  loggedInUserProfileId: number;
  role: string;
  commentId: number;
  isFollowed: boolean;
  isMuted: boolean;
  commentAuthorName: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteFn: () => void;
  onMuteOrFollowFn: OnMuteOrFollowFn;
}
export function CommentsThreeDotMenu({
  commentAuthorProfileId,
  loggedInUserProfileId,
  role,
  commentId,
  isFollowed,
  isMuted,
  commentAuthorName,
  setEditing,
  onDeleteFn,
  onMuteOrFollowFn
}: CommentsThreeDotMenuProps): JSX.Element {
  const editOrDelete =
    commentAuthorProfileId === loggedInUserProfileId || role === ROLES.ADMIN;
  const [loading, setLoading] = useState<'notLoading' | 'follow' | 'mute'>(
    'notLoading'
  );
  const isAuthorTheUser = commentAuthorProfileId === loggedInUserProfileId;
  const chooseOnClick = (fn: any) =>
    loading === 'notLoading' ? fn : undefined;
  return (
    <div
      className={clsx(
        classes.container,
        'cursorPointer',
        loading !== 'notLoading' && 'opacity-25'
      )}
    >
      {editOrDelete && <div onClick={chooseOnClick(onDeleteFn)}>Delete</div>}
      {editOrDelete && (
        <div onClick={chooseOnClick(() => setEditing(true))}>Edit</div>
      )}
      {!isAuthorTheUser &&
        (loading === 'follow' ? (
          <div>Loading...</div>
        ) : isFollowed ? (
          <div
            onClick={chooseOnClick(() =>
              onMuteOrFollowFn(
                setLoading,
                commentId,
                'follow',
                commentAuthorProfileId,
                isFollowed
              )
            )}
          >
            Unfollow {commentAuthorName}
          </div>
        ) : (
          <div
            onClick={() =>
              chooseOnClick(
                onMuteOrFollowFn(
                  setLoading,
                  commentId,
                  'follow',
                  commentAuthorProfileId,
                  isFollowed
                )
              )
            }
          >
            Follow {commentAuthorName}
          </div>
        ))}
      {!isAuthorTheUser &&
        (loading === 'mute' ? (
          <div>Loading...</div>
        ) : isMuted ? (
          <div
            onClick={chooseOnClick(() =>
              onMuteOrFollowFn(setLoading, commentId, 'unmute')
            )}
          >
            Unmute this thread
          </div>
        ) : (
          <div
            onClick={chooseOnClick(() =>
              onMuteOrFollowFn(setLoading, commentId, 'mute')
            )}
          >
            Mute this thread
          </div>
        ))}
    </div>
  );
}
