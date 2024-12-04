import {ComponentType, useCallback, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {HeartIconPropsType} from '@/ds/Icons/heart';
import {FEEDS} from '@/utils/common/commonTypes';
import {
  toggleFeedsLike,
  toggleLikeOnComment
} from '@/store/reducers/likeReducer';
import Link from 'next/link';
import {ProfileTooltip} from '@/components/ProfileTooltip';

interface LikeheartProps extends Omit<HeartIconPropsType, 'loading'> {
  id: string;
  feedsType: FEEDS;
  commentId?: number;
  feedsTypeMapping: string;
}
export default function withLikeApiCall(
  Component: ComponentType<HeartIconPropsType>
): React.ComponentType<LikeheartProps> {
  const renderUserList = (likedBy: HeartIconPropsType['likedBy']) =>
    likedBy?.map(({id, name}) => (
      <ProfileTooltip profile={{id}} key={id}>
        <div>
          <Link href="#">{name}</Link>
        </div>
      </ProfileTooltip>
    ));

  return function ({
    feedsType,
    id,
    commentId,
    feedsTypeMapping,
    ...props
  }: LikeheartProps) {
    const userInfo = useSelector(selectUserInfo());
    const callApi = useAPI();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const payload = {
      authorName: userInfo.name,
      authorProfileId: userInfo.profileId,
      feedId: id
    };
    const makeLikeRequest = useCallback(async () => {
      setLoading(true);
      if (commentId)
        dispatch(
          toggleLikeOnComment({
            ...payload,
            commentId
          })
        );
      else
        dispatch(
          toggleFeedsLike({
            ...payload,
            feedsType
          })
        );
      try {
        await callApi(
          'postLike',
          {
            id,
            feedsType: feedsTypeMapping,
            userName: userInfo?.name,
            userId: userInfo?.id,
            commentId: commentId
          },
          {method: 'post'}
        );
      } catch (err) {
        console.log(err);
        if (commentId)
          dispatch(
            toggleLikeOnComment({
              ...payload,
              commentId
            })
          );
        else
          dispatch(
            toggleFeedsLike({
              ...payload,
              feedsType
            })
          );
      } finally {
        setLoading(false);
      }
    }, [userInfo, id, feedsType, callApi]);
    return (
      <Component
        {...props}
        loading={loading}
        makeLikeRequest={makeLikeRequest}
        renderUserList={renderUserList}
      />
    );
  };
}
