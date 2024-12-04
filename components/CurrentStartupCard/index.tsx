import React, {useEffect, useState} from 'react';

import styles from './CurrentStartupCard.module.scss';
import Card from '@/ds/Card/card';
import FnText from '@/ds/FnText';
import useAPI from '@/utils/common/useAPI';
import {ProfileData} from '@/types/profile';

import Image from 'next/image';
import Link from 'next/link';
import {addURLProtocol} from '@/utils/addURLProtocol';

interface IProps {
  profileData: ProfileData;
}

export const CurrentStartupCard: React.FC<IProps> = props => {
  const {profileData} = props;

  const [showCompanyLogo, setShowCompanyLogo] = useState(true);

  const api = useAPI();

  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        if (profileData && profileData.id) {
          const data: any = await api('getCompanyProfile', {
            profileId: profileData?.id
          });
          setCompanyData(data);
        } else {
          console.log('Profile data or profile id is not available.');
        }
      } catch (error) {
        console.error('Error fetching company profile data:', error);
      }
    };

    fetchCompanyProfile();
  }, [api, profileData?.id]);

  return (
    <Card className={styles.CurrentStartupCard}>
      <FnText type="heading-sm" bold>
        Current Startup
      </FnText>
      {companyData?.data?.companyLogoUrl && (
        <a
          className={styles.logoContainer}
          href={companyData?.data?.companyLogoUrl}
          target="_blank"
        >
          {showCompanyLogo && (
            <Image
              src={companyData?.data?.companyLogoUrl}
              alt="Company Logo"
              width={130}
              height={80}
              onError={() => setShowCompanyLogo(false)}
              style={{
                objectFit: 'contain',
                objectPosition: 'left'
              }}
            />
          )}
        </a>
      )}
      <a href={addURLProtocol(profileData?.company?.url)} target="_blank">
        <FnText bold type="heading-xSmall">
          {profileData?.company?.name}
        </FnText>
      </a>
      <div className={styles.startupNameDescription}>
        <div>
          <FnText>{profileData?.company?.shortDescription}</FnText>
        </div>
      </div>
      {companyData?.data?.location?.name && (
        <div className={styles.location}>
          <FnText type="heading-xSmall" bold>
            Location
          </FnText>
          <FnText>{companyData?.data?.location?.name}</FnText>
        </div>
      )}
      {companyData?.data?.sectors?.length > 0 && (
        <div className={styles.techSectors}>
          <FnText bold type="heading-xSmall">
            Tech sectors
          </FnText>
          <ul>
            {companyData?.data.sectors?.map(
              (sector: {id: number; name: string}) => (
                <li key={sector.id}>{sector.name}</li>
              )
            )}
          </ul>
        </div>
      )}
      {companyData?.data.investmentSector?.length > 0 && (
        <div className={styles.industry}>
          <FnText bold type="heading-xSmall">
            Industry
          </FnText>
          <ul>
            {companyData?.data.investmentSector?.map(
              (sector: {id: number; name: string}) => (
                <li>{sector.name}</li>
              )
            )}
          </ul>
        </div>
      )}
      <div className={styles.stage}>
        <FnText bold type="heading-xSmall">
          Stage:
        </FnText>
        <FnText>{companyData?.data?.stage}</FnText>
      </div>
      {companyData?.data?.accelerator?.length > 0 && (
        <div className={styles.accelerator}>
          <FnText bold type="heading-xSmall">
            Accelerator
          </FnText>
          {/* <FnText>{companyData?.data?.accelerator?.map(acc => acc)}</FnText> */}
        </div>
      )}
      {companyData?.data.currentMonthlyRevenue && (
        <div className={styles.currentInvestors}>
          <FnText type="heading-xSmall" bold>
            Current investors
          </FnText>
          <FnText>{companyData?.data?.currentMonthlyRevenue}</FnText>
        </div>
      )}
    </Card>
  );
};

export default CurrentStartupCard;
