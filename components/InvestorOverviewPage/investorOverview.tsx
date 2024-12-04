import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {selectInvestorDetail, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {InvestorProfile} from './InvestorProfile/investorProfile';
import {Spinner} from '@/ds/Spinner';
import {InvestorInfo} from './InvestorInfo/investorInfo';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
import ProfileHeaderCard from '../ProfileHeaderCard';
import Card from '@/ds/Card/card';
import FnText from '@/ds/FnText';

import styles from './investorOverview.module.scss';

export enum Tab {
  Overview = 'overview',
  Function = 'function',
  Introductions = 'introductions',
  Opportunities = 'opportunities'
}

const TabToShow = [Tab.Overview, Tab.Function];

export const InvestorOverview = () => {
  const router = useRouter();
  const {investorId} = useRouter().query;
  const userInfo = useSelector(selectUserInfo());
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Overview);
  const investorDetails = useSelector(
    selectInvestorDetail(investorId as string)
  );

  const makeApiCall = useAPI();

  const fetchInvestorDetails = useCallback(async () => {
    const res = await makeApiCall('getInvestorOverview', {
      userId: userInfo?.id,
      investorId,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    }).catch(err => {
      if (!(err.errorObj instanceof ConcurrentApiNotAllowed))
        router.replace('/404');
    });
  }, [userInfo?.id, makeApiCall]);

  useEffect(() => {
    if (userInfo?.id && investorId && !investorDetails?.coverImageUrl)
      fetchInvestorDetails();
  }, [userInfo?.id]);

  return (
    <div>
      {/* <ProfileHeaderCard
        avatarUrl={investorDetails?.avatarUrl}
        about={investorDetails?.overview?.background}
        companyName={investorDetails?.company}
        coverImageUrl={investorDetails?.coverImageUrl}
        insiderInformation={investorDetails?.overview?.insiderInformation}
        name={investorDetails?.name}
        title={investorDetails?.designation}
      /> */}
      <Card className={styles.fundingPreferencesCard}>
        <FnText type="heading-sm">Funding Preferences</FnText>
      </Card>
      {/* <InvestorProfile
        avatarUrl={investorDetails?.avatarUrl}
        name={investorDetails?.name}
        companyName={investorDetails?.companyName}
        designation={investorDetails?.designation}
        coverImage={investorDetails?.coverImageUrl}
        social={investorDetails?.social}
        showIntroductionButton={investorDetails?.showIntroductionButton}
        userId={userInfo?.id}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabToShow={TabToShow}
        updateInvestmentLink={true}
      /> */}
      {Tab.Overview === currentTab && (
        <div>
          <InvestorInfo overview={investorDetails?.overview} userInvestment />
        </div>
      )}
    </div>
  );
};
