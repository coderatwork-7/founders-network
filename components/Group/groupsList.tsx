import React, {useContext} from 'react';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {useSelector} from 'react-redux';
import {selectGroups, selectUserInfo} from '@/store/selectors';
import {GroupsCard} from '@/ds/GroupsCard';
import {GroupsPageFacetsContext} from '../ContextProviders/GroupsFacetsContext';
import useAPI from '@/utils/common/useAPI';

export const GroupsList: React.FC<{ids: string[]}> = ({ids}) => {
  const api = useAPI();
  const {id: userId} = useSelector(selectUserInfo()) ?? {};
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const data = useSelector(selectGroups());
  const {setSelectedFacetValues, setApplyFacets} = useContext(
    GroupsPageFacetsContext
  );

  const handleJoinGroup = (groupId: string, isPrivate: boolean) => {
    return api(
      isPrivate ? 'postRequestGroupInvite' : 'postJoinGroup',
      {userId, groupId},
      {method: 'POST'}
    );
  };

  return (
    <>
      <div className="row m-auto text-start gy-3 gx-0">
        {ids.map(id => (
          <GroupsCard
            key={id}
            data={data[id]}
            isMobile={isMobile}
            setSelectedFacetValues={setSelectedFacetValues}
            setApplyFacets={setApplyFacets}
            handleJoinGroup={handleJoinGroup}
          />
        ))}
      </div>
    </>
  );
};
