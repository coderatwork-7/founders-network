import Avatar from '@/ds/Avatar/avatar';

import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';

import {
  faAngellist,
  faFacebookF,
  faLinkedinIn,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';

import styles from './investProfile.module.scss';

import {IntroRequestModal} from '@/components/Intro/introRequestModal';
import {Tab} from '../investorOverview';

import Card from '@/ds/Card/card';
import FnText from '@/ds/FnText';

interface SocialLinksType {
  twitterUrl: string;
  linkedInUrl: string;
  angelListUrl: string;
  facebookUrl: string;
}

interface InvestorProfilePropsType {
  avatarUrl: string;
  name: string;
  companyName: string;
  designation: string;
  coverImage: string;
  social: SocialLinksType;
  showIntroductionButton: boolean;
  userId: number;
  currentTab: Tab;
  setCurrentTab: Dispatch<SetStateAction<Tab>>;
  tabToShow: Tab[];
  updateInvestmentLink?: boolean;
}

const SocialLinksMapping: any = {
  twitterUrl: faXTwitter,
  linkedInUrl: faLinkedinIn,
  angelListUrl: faAngellist,
  facebookUrl: faFacebookF
};

export const InvestorProfile: React.FC<InvestorProfilePropsType> = ({
  avatarUrl,
  name,
  companyName,
  designation,
  coverImage,
  social,
  showIntroductionButton,
  userId,
  currentTab,
  setCurrentTab,
  tabToShow,
  updateInvestmentLink
}) => {
  const [showIntroForm, setShowIntroForm] = useState<boolean>(false);

  return (
    <div>
      {showIntroForm && (
        <IntroRequestModal
          investorId={parseInt(`${userId ?? 0}`)}
          show={showIntroForm}
          onHide={() => setShowIntroForm(false)}
        />
      )}
      <Card className={styles.headerCard}>
        <img src={coverImage} className={styles.coverImage} />
        <div className={styles.headerContent}>
          <div className={styles.avatarContainer}>
            <Avatar
              avatarUrl={avatarUrl}
              altText={name}
              imageHeight={180}
              imageWidth={180}
              newDesign
            />
          </div>
          <FnText bold type="heading-sm">
            {name}
          </FnText>
          <FnText>
            {designation}, {companyName}
          </FnText>
          <FnText type="heading-xSmall" bold>
            About it
          </FnText>
        </div>
      </Card>
      {/* <div className={styles.inviteInvestorHeader}>
        Invite your investors to be part of the [fn]Investor Program{' '}
        <Link
          className={styles.link}
          href={'https://foundersnetworkfund.com/investor-program/'}
          target="_blank"
        >
          here
        </Link>
        .
      </div> */}
      {/* <div
        style={{
          backgroundImage: `url(${coverImage})`
        }}
        className={styles.mainContainer}
      >




        {!showIntroductionButton ? (
          <div className={styles.tabContainer}>
            <div className={styles.tabs}>
              {tabToShow?.map(tab => {
                return (
                  <div
                    key={tab}
                    className={clsx(currentTab === tab && styles.active)}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-center gap-3">
              {social &&
                Object?.keys(social)
                  ?.filter(
                    (ele: string) => social[ele as keyof SocialLinksType] !== ''
                  )
                  ?.map(link => {
                    return (
                      <Link
                        key={link}
                        href={social[link as keyof SocialLinksType]}
                        className={styles.link}
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={SocialLinksMapping[link]} />
                      </Link>
                    );
                  })}
            </div>
          </div>
        ) : (
          <div>
            <Button
              variant={ButtonVariants.OutlinePrimary}
              textUppercase
              onClick={() => setShowIntroForm(true)}
            >
              Request Introduction
            </Button>
          </div>
        )}
      </div> */}
      {/* {updateInvestmentLink && (
        <div className={styles.inviteInvestorHeader}>
          Please{' '}
          <Link className={styles.link} href="/investors?matchSettings">
            Update
          </Link>{' '}
          your amount looking to raise to find out if you match with this
          investor.
        </div>
      )} */}
    </div>
  );
};
