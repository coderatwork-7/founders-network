import {INVESTOR_OVERVIEW_PAGE_TITLE} from '@/utils/common/constants';
import Head from 'next/head';
import styles from './investorOverview.module.scss';

import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectInvestorDetail, selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
import ProfileHeaderCard from '@/components/ProfileHeaderCard';
import Card from '@/ds/Card/card';
import FnText from '@/ds/FnText';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import InvestorCompatibilityCard from '@/components/InvestorCompatibilityCard';
import IntroRequestModal from '@/components/IntroRequestModal';
import {useUserDetailQuery} from '@/genericApi/foundersNetwork/queries/useUserDetailQuery';

export default function InvestorOverviewPage(): JSX.Element {
  const [showIntroForm, setShowIntroForm] = useState(false);

  useAuth();
  const router = useRouter();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  const {data: session} = useSession();

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  const {investorId} = useRouter().query;

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

  const getUserCompanyData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user.profileId}/company`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
    return await res.json();
  };

  const {data: userCompanyData, isLoading: isLoadingUserCompanyData} = useQuery(
    {
      queryKey: ['userCompanyData'],
      queryFn: getUserCompanyData,
      enabled: !!userInfo?.profileId
    }
  );

  const userId = session?.user.id;

  const {data: userData} = useUserDetailQuery(userId);

  const hasInvestorContactPermission = userData?.paymentPlan !== 'bootstrap';

  if (!investorId) {
    return <div>Please try again.</div>;
  }

  return (
    <>
      <Head>
        <title>{INVESTOR_OVERVIEW_PAGE_TITLE}</title>
      </Head>
      <main className={styles.investor}>
        <div className={styles.content}>
          <ProfileHeaderCard
            role="Investor"
            profileId={investorId as string}
            avatarUrl={investorDetails?.avatarUrl}
            about={investorDetails?.overview?.background}
            companyName={investorDetails?.company}
            coverImageUrl={investorDetails?.coverImageUrl}
            insiderInformation={investorDetails?.overview?.insiderInformation}
            firstName={investorDetails?.name.split(' ')[0]}
            lastName={investorDetails?.name.split(' ')[1]}
            title={investorDetails?.designation}
            expertise={investorDetails?.expertise}
            introRequested={investorDetails?.requestStatus.requested}
            isCompatible={investorDetails?.overview?.isProfileMatch}
          />
          <div className={styles.fundingCompatibilityContainer}>
            <Card className={styles.fundingPreferencesCard}>
              <FnText type="heading-xSmall" bold>
                Funding Preferences
              </FnText>

              <FnDescriptionList>
                <FnDescriptionListItem
                  title="Invests in"
                  description={investorDetails?.overview?.investsIn}
                />
                <FnDescriptionListItem
                  title="Investment range"
                  description={investorDetails?.overview?.investmentRange}
                />
                <FnDescriptionListItem
                  title="Investment sectors"
                  description={investorDetails?.overview?.sector}
                />
                <FnDescriptionListItem
                  title="Investment locations"
                  description={investorDetails?.overview?.investmentLocations}
                />
              </FnDescriptionList>
            </Card>
            <InvestorCompatibilityCard
              isCompatible={investorDetails?.overview?.isProfileMatch}
              userStage={userCompanyData?.stage}
              userSectors={userCompanyData?.sectors}
              userLocation={userCompanyData?.location.name}
              userLookingToRaise={userCompanyData?.lookingToRaise}
              setShowIntroForm={setShowIntroForm}
              // stageIsCompatible
              // sectorsIsCompatible={false}
              // locationIsCompatible={false}
            />
          </div>
        </div>
        {showIntroForm && hasInvestorContactPermission && investorId && (
          <IntroRequestModal
            memberName={userData?.name}
            investorId={investorId as string}
            investorProfileId={investorDetails.profileId}
            investorName={investorDetails?.name}
            show={showIntroForm}
            setShow={setShowIntroForm}
            onHide={() => setShowIntroForm(false)}
          />
        )}
      </main>
    </>
  );
}
