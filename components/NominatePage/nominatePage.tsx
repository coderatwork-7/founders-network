import {useSelector} from 'react-redux';
import {NominateInfo} from './NominateInfo';
import {SponsoredMember} from './SponsoredMember';
import {TopNominateTable} from './TopNomainteTable';
import {selectNominationInfo, selectUserInfo} from '@/store/selectors';
import {useEffect} from 'react';
import useAPI from '@/utils/common/useAPI';
import {NominateInvite} from './NominateInvite';
import Image from 'next/image';
import {Spinner} from '@/ds/Spinner';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';

import styles from './nominatePage.module.scss';
import FnText from '@/ds/FnText';

import ClockIcon from '@/public/svgIcons/clock_icon.svg';

export const NominatePage = () => {
  const userInfo = useSelector(selectUserInfo());
  const nominateInfo = useSelector(selectNominationInfo());
  const makeApiCall = useAPI();

  const getNominationStatsInfo = async () => {
    await makeApiCall('getNominationStatsInfo', {
      userId: userInfo?.id,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  useEffect(() => {
    if (!nominateInfo?.list && userInfo?.id) getNominationStatsInfo();
  }, [userInfo?.id]);

  if (!nominateInfo?.list)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner />
      </div>
    );

  return (
    <div className={styles.nominatePage}>
      <FnText type="heading-md" bold className={styles.pageHeader}>
        Grow your network by growing Founders Network
      </FnText>
      <div className={styles.bannerRow}>
        <Image src={ClockIcon} width={40} height={40} alt="Clock" />
        <FnText bold className={styles.bannerHeader}>
          {nominateInfo?.title}
        </FnText>
      </div>
      <div className={styles.firstRow}>
        <div className={styles.leftColumn}>
          <NominateInvite
            remainingNomination={nominateInfo?.remainingNominations}
            requestedNomination={nominateInfo?.requestedNomination}
            cohort={nominateInfo?.cohort}
            userId={userInfo?.id}
          />
          <SponsoredMember sponsoredMembers={nominateInfo?.sponsoredMembers} />
        </div>
        <TopNominateTable />
      </div>
      <NominateInfo />
    </div>
  );
};
