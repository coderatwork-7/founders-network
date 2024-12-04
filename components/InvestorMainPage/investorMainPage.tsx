import {useSelector} from 'react-redux';
import {InvestorProfile} from '../InvestorOverviewPage/InvestorProfile/investorProfile';
import {selectInvestorInfo, selectUserInfo} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {useEffect, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {Tab} from '../InvestorOverviewPage/investorOverview';
import {InvestorInfo} from '../InvestorOverviewPage/InvestorInfo/investorInfo';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {InvestorIntroductions} from './InvestorIntroductions/investorIntroductions';
import styles from './investorMain.module.scss';
import clsx from 'clsx';
import {InvestorOpporunities} from './InvestorOpporunities/investorOpporunities';
import {isObjectEmpty} from '@/utils/common/helper';
import ProfileHeaderCard from '../ProfileHeaderCard';

const TabToShow = [Tab.Overview, Tab.Introductions, Tab.Opportunities];

export const InvestorMainPage = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Overview);
  const userInfo = useSelector(selectUserInfo());
  const investorInfo = useSelector(selectInvestorInfo('overview'));

  const makeApiCall = useAPI();
  const fetchInvestorOverview = async () => {
    return makeApiCall('getInvestorDetails', {
      userId: userInfo?.id,
      type: 'overview',
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  useEffect(() => {
    if (userInfo?.id && !investorInfo?.name) fetchInvestorOverview();
  }, [userInfo?.id]);

  // if (isObjectEmpty(investorInfo)) return <Spinner className="mt-5" />;

  return (
    <div>
      <div>
        {/* <ProfileHeaderCard
          avatarUrl={investorInfo?.avatarUrl}
          name={investorInfo?.name}
          companyName={investorInfo?.company}
          title={investorInfo?.designation}
          coverImageUrl={investorInfo?.coverImageUrl}
        /> */}
        {/* <InvestorProfile
          avatarUrl={investorInfo?.avatarUrl}
          name={investorInfo?.name}
          companyName={investorInfo?.company}
          designation={investorInfo?.designation}
          coverImage={investorInfo?.coverImageUrl}
          social={investorInfo?.social}
          showIntroductionButton={false}
          userId={userInfo?.id}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabToShow={TabToShow}
        /> */}
      </div>

      {Tab.Overview === currentTab && (
        <div>
          <InvestorInfo overview={investorInfo?.overview} />
        </div>
      )}

      {Tab.Introductions === currentTab && (
        <div className={clsx(styles.layout, 'my-3')}>
          <InvestorIntroductions />
        </div>
      )}
      {Tab.Opportunities === currentTab && (
        <div className={clsx(styles.layout, 'my-3')}>
          <InvestorOpporunities />
        </div>
      )}
    </div>
  );
};
