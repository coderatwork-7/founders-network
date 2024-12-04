import {GroupsDetailForumsFacetsProvider} from '@/components/ContextProviders/GroupsDetailForumsFacetsContext';
import {GroupsDetailFunctionsFacetsProvider} from '@/components/ContextProviders/GroupsDetailFunctionsFacetsContext';
import {GroupsDetailMembersFacetsProvider} from '@/components/ContextProviders/GroupsDetailMembersFacetsContext';
import {CreateForumFeed} from '@/components/CreateForumFeed';
import {GroupContentSelectionWidget} from '@/components/GroupDetail/groupContentSelectionWidget';
import {GroupDetailForumsDashboard} from '@/components/GroupDetail/groupDetailForumsDashboard';
import {GroupDetailFunctionsDashboard} from '@/components/GroupDetail/groupDetailFunctionsDashboard';
import {GroupDetailMembersDashboard} from '@/components/GroupDetail/groupDetailMembersDashboard';
import {GroupDetailWidget} from '@/components/GroupDetail/groupDetailWidget';
import {GroupPageController} from '@/components/GroupDetail/GroupPageController';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import Head from 'next/head';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export interface GroupDetails {
  description: string;
  title: string;
  count: string;
  email: string;
}

export default function Group(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const [groupDetails, setGroupDetails] = useState<GroupDetails>({
    description: '',
    title: '',
    count: ' - ',
    email: 'email'
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  return (
    <GroupsDetailMembersFacetsProvider>
      <GroupsDetailForumsFacetsProvider>
        <GroupsDetailFunctionsFacetsProvider>
          <Head>
            <title>Groups | Founders Network</title>
          </Head>
          <GroupPageController
            setGroupDetails={setGroupDetails}
            setSelectedTab={setSelectedTab}
          />
          <main className={`pageLayout`}>
            <div className="leftContainer">
              <CreateForumFeed
                groupEmail={groupDetails?.email}
                groupDisplayName={groupDetails?.title}
              />
              <GroupDetailWidget data={groupDetails} />
              <div className={clsx(isMobile && 'mb-2')}>
                <GroupContentSelectionWidget
                  groupDetail={groupDetails}
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                />
              </div>
              {!isMobile && <NominationWidget />}
            </div>
            <div className="rightContainer">
              <div className={clsx(selectedTab !== 0 && 'd-none')}>
                {GroupDetailForumsDashboard}
              </div>
              <div className={clsx(selectedTab !== 1 && 'd-none')}>
                {GroupDetailFunctionsDashboard}
              </div>
              <div className={clsx(selectedTab !== 2 && 'd-none')}>
                {GroupDetailMembersDashboard}
              </div>
            </div>
          </main>
        </GroupsDetailFunctionsFacetsProvider>
      </GroupsDetailForumsFacetsProvider>
    </GroupsDetailMembersFacetsProvider>
  );
}
