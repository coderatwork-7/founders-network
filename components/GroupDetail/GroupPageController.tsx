import {GroupDetails} from '@/pages/group/[groupId]';
import {selectGroupDetails, selectUserInfo} from '@/store/selectors';
import {usePathname} from 'next/navigation';
import {Dispatch, SetStateAction, useEffect} from 'react';
import {useSelector} from 'react-redux';
import useAPI from '@/utils/common/useAPI';
import {
  CONST_FUNCTIONS,
  CONST_MEMBERS,
  GROUP_ACTIVE_TAB
} from '@/utils/common/constants';

export function GroupPageController({
  setGroupDetails,
  setSelectedTab
}: {
  setGroupDetails: Dispatch<SetStateAction<GroupDetails>>;
  setSelectedTab: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const groupId = usePathname()?.slice(1).split('/')[1];
  const data = useSelector(selectGroupDetails(groupId));
  const user = useSelector(selectUserInfo());
  const makeApiCall = useAPI();

  useEffect(() => {
    if (groupId) {
      const tab = new URLSearchParams(window.location.search).get(
        GROUP_ACTIVE_TAB
      );
      if (tab === CONST_FUNCTIONS) setSelectedTab(1);
      else if (tab === CONST_MEMBERS) setSelectedTab(2);
    }
  }, [groupId]);
  useEffect(() => {
    if (data) {
      setGroupDetails({
        description: data?.description || 'No description',
        title: data?.title ?? 'Title',
        count: data?.membersCount ?? '0',
        email: data?.email || 'Email'
      });
    }
  }, [data]);

  useEffect(() => {
    if (user && groupId)
      makeApiCall('getGroupDetails', {userId: user?.id, groupId});
  }, [user, groupId, makeApiCall]);
  return <></>;
}
