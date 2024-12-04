import Avatar from '@/ds/Avatar/avatar';
import Card from '@/ds/Card/card';
import styles from './investorCard.module.scss';
import Link from 'next/link';
import {Button, ButtonVariants} from '@/ds/Button';
import useChatModal from '@/hooks/useChatModal';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {el} from 'date-fns/locale';

const LifetimeStatsInfo = [
  {
    title: 'Number of Startups',
    value: 'numberOfStartupsRun'
  },
  {
    title: 'Lifetime Funding',
    value: 'lifetimeFunding'
  },
  {
    title: 'Value Of Exits',
    value: 'totalValueOfExits'
  },
  {
    title: 'Employees Hired',
    value: 'numberOfEmployeesHired'
  },
  {
    title: 'Accomplishments',
    value: 'accomplishments'
  }
];

const CompanyStatsInfo = [
  {
    title: 'Target Market',
    value: 'targetMarket'
  },
  {
    title: 'Monetization',
    value: 'monetization'
  },
  {
    title: 'Monthly Revenue',
    value: 'monthlyRevenue'
  },
  {
    title: 'Revenue Growth Rate',
    value: 'revenueGrowthRate'
  },
  {
    title: 'New User Grow Rate',
    value: 'newUserGrowthRate'
  },
  {
    title: 'Notable Investors',
    value: 'notableInvestors'
  }
];

export const InvestorCard = ({userDetails}: {userDetails: any}) => {
  const company = userDetails?.company;
  const openChatModal = useChatModal();
  const isMObile = Breakpoint.mobile == useBreakpoint();

  const handleMessageClick = () => {
    openChatModal({
      userId: userDetails?.userId,
      name: userDetails?.name,
      profileImage: userDetails?.avatarUrl
    });
  };
  const showLifetimeStats =
    LifetimeStatsInfo?.map(ele => userDetails[ele.value]).filter(
      ele => ele !== null && ele !== '' && ele !== undefined
    ).length > 0;
  const showCompanyStats =
    CompanyStatsInfo?.map(ele => company[ele.value]).filter(
      ele => ele !== null && ele !== '' && ele !== undefined
    ).length > 0;
  return (
    <Card className={styles.cardContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.imageSection}>
          <Avatar
            avatarUrl={userDetails?.avatarUrl}
            altText={userDetails?.name}
            newDesign
            imageWidth={120}
            imageHeight={120}
            badge={userDetails?.badge}
          />

          <div className="d-flex justify-content-center">
            <img
              src={company?.logoUrl}
              alt={company?.name}
              className={styles.companyImage}
            />
          </div>
        </div>
        <div className={styles.contentSection}>
          <div
            className={clsx(
              'd-flex justify-content-between',
              isMObile && 'flex-column-reverse gap-2'
            )}
          >
            <h5>
              {userDetails?.linkedInUrl !== '' ? (
                <Link href={userDetails?.linkedInUrl}>{userDetails?.name}</Link>
              ) : (
                userDetails?.name
              )}{' '}
              of{' '}
              {company?.website !== '' ? (
                <Link href={company?.website}>{company?.name}</Link>
              ) : (
                company?.name
              )}
            </h5>
            <div>
              <Button
                variant={ButtonVariants.CardPrimary}
                textUppercase
                className={styles.messageButton}
                onClick={() => handleMessageClick()}
              >
                message
              </Button>
            </div>
          </div>
          <div className={styles.tagContainer}>
            <div>{company?.description}</div>
            {company?.lookingToRaise && (
              <div>
                <span>Looking to Raise</span>:{' '}
                <span className={styles.valueContainer}>
                  {company?.lookingToRaise}
                </span>
              </div>
            )}
            {userDetails?.lifetimeFunding && (
              <div>
                <span>Funding to Date</span>:{' '}
                <span className={styles.valueContainer}>
                  {userDetails?.lifetimeFunding}
                </span>
              </div>
            )}
            {userDetails?.monthlyUpdates && (
              <div>
                <span>Funding to Date</span>:{' '}
                <span>{userDetails?.lifetimeFunding}</span>
              </div>
            )}
          </div>
          {showLifetimeStats && (
            <div>
              <h5 className="my-3">Lifetime Founder Stats</h5>
              {LifetimeStatsInfo?.map(ele => {
                if (!userDetails[ele?.value]) return null;
                return (
                  <div className={styles.tagContainer} key={ele?.title}>
                    <span className={styles.titleContainer}>{ele?.title}</span>:{' '}
                    <span className={styles.valueContainer}>
                      {userDetails[ele?.value]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {showCompanyStats && (
            <div>
              <h5 className="my-3">{company?.name} Stats</h5>
              {CompanyStatsInfo?.map(ele => {
                let value = company[ele?.value];
                if (ele?.value === 'notableInvestors')
                  value = userDetails?.notableInvestors;
                if (value === '') return null;
                return (
                  <div className={styles.tagContainer} key={ele?.title}>
                    <span>{ele?.title}</span>:{' '}
                    <span className={styles.valueContainer}>{value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className={styles.footerContainer}>
        <div>
          <span className={styles.valueContainer}>Location:</span>{' '}
          <span>{userDetails?.location}</span>
        </div>
        <div>
          <span className={styles.valueContainer}>Stage:</span>{' '}
          <span>{userDetails?.stage}</span>
        </div>
        <div>
          <span className={styles.valueContainer}>Sector:</span>{' '}
          <span>{userDetails?.sector}</span>
        </div>
      </div>
    </Card>
  );
};
