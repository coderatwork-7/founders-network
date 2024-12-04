import clsx from 'clsx';
import {CommentData} from '../commentsBox';
import Avatar from '@/ds/Avatar/avatar';
import Link from 'next/link';
import DisplayDateTime from '@/components/Common/displayDateTime';
import {EllipsisIcon} from '@/ds/Icons';
import {Popover} from '@/ds/Popover';
import {CommentsThreeDotMenu} from './commentsThreeDotMenu';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {OnMuteOrFollowFn} from './commentsCard';

export const CommentsCardHeader: React.FC<{
  data: CommentData;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  onDeleteFn: () => void;
  onMuteOrFollowFn: OnMuteOrFollowFn;
}> = ({data, setEditing, editing, onDeleteFn, onMuteOrFollowFn}) => {
  const {
    author: {profileId, name, badge, avatarUrl},
    datetime: {creationDate},
    id
  } = data;
  const {profileId: loggedInUserProfileId, role} = useSelector(
    selectUserInfo()
  );

  return (
    <div className={clsx('d-flex justify-content-between align-items-center')}>
      <div className={clsx('d-flex gap-3')}>
        <Avatar
          avatarUrl={avatarUrl}
          altText={`${profileId}`}
          badge={badge}
          newDesign
        />
        <div className={clsx('d-flex flex-column')}>
          <Link href={`/profile/${profileId}`}>{name}</Link>
          <DisplayDateTime creationDate={creationDate} />
        </div>
      </div>

      <Popover
        popover={
          <CommentsThreeDotMenu
            commentAuthorName={name}
            commentAuthorProfileId={profileId}
            loggedInUserProfileId={loggedInUserProfileId}
            isFollowed={data.followThread ?? false}
            isMuted={data.muteThread ?? false}
            role={role}
            setEditing={setEditing}
            onDeleteFn={onDeleteFn}
            onMuteOrFollowFn={onMuteOrFollowFn}
            commentId={id}
          />
        }
        placement="bottom-end"
        mode="click"
        hideOnBlur
        forceClose={editing}
      >
        <div className="pe-2">
          <EllipsisIcon />
        </div>
      </Popover>
    </div>
  );
};
