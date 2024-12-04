import {Button, ButtonVariants} from '@/ds/Button';
import styles from './MembershipLevel.module.scss';
import {TestimonialCard} from '../TestimonialCard';
import Image from 'next/image';

import PercentIconSvg from '@/public/svgIcons/percent_icon.svg';
import QuestionsIconSvg from '@/public/svgIcons/phone_icon.svg';
import MailIconSvg from '@/public/svgIcons/mail_icon.svg';
import Card from '@/ds/Card/card';
import clsx from 'clsx';

import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

import {CURRENT_FOUDNER_COUNT} from '@/utils/common/constants';
import {OnboardingTooltip} from '@/components/Onboarding/OnboardingTooltip';
import {selectUserInfo} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {membershipPlans} from '@/utils/data/membershipPlans';
import {useState} from 'react';
import FnText from '@/ds/FnText';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import FnTabNavigation from '@/ds/FNTabNavigation';
import {TPlan, upgradePlans} from '@/utils/data/plans';
import UpgradeModal from '../UpgradeModal';

import AngelIconSvg from '@/public/svgIcons/angel_icon.svg';
import LifetimeIconSvg from '@/public/svgIcons/Lifetime_no_border.svg';
import SeriesAIconSvg from '@/public/svgIcons/diamont_icon.svg';

interface MembershipLevelPropsType {
  plan: string;
}

export const MembershipLevel = ({plan}: MembershipLevelPropsType) => {
  const userInfo = useSelector(selectUserInfo());

  const isMobile = Breakpoint.mobile === useBreakpoint();

  const [activePlan, setActivePlan] = useState(plan);

  const membershipPlan =
    membershipPlans[
      activePlan.toLocaleLowerCase() as keyof typeof membershipPlans
    ];

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const benefitsIcon =
    activePlan === 'Lifetime'
      ? LifetimeIconSvg
      : activePlan === 'Lead'
      ? SeriesAIconSvg
      : AngelIconSvg;

  return (
    <>
      <UpgradeModal
        showModal={showUpgradeModal}
        setShowModal={setShowUpgradeModal}
        plan={activePlan as TPlan}
      />

      <Card className={styles.MembershipLevel}>
        <FnText type="heading-lg" bold>
          {activePlan} membership benefits
        </FnText>
        <FnTabNavigation
          tabs={upgradePlans}
          activeTab={activePlan}
          setActiveTab={setActivePlan}
        />

        <div className={styles.onboarding}>
          <OnboardingTooltip type="addon" position="right" />
        </div>

        {userInfo?.paymentPlan !== 'lifetime' && (
          <Button
            className={clsx(styles.upgradeButton)}
            variant={ButtonVariants.BluePrimary}
            textUppercase
            onClick={() => setShowUpgradeModal(true)}
          >
            {`Upgrade to ${activePlan} plan`}
          </Button>
        )}

        <div className={styles['includedBenefitsContainer']}>
          <div>
            <div className={styles.includedBenefitsHeading}>
              <Image
                className={clsx(styles['iconStyles'])}
                src={benefitsIcon}
                alt="Percentage"
              />
              <div>
                <FnText type="heading-xSmall" bold>
                  Included benefits:
                </FnText>
                <FnText italic>
                  Everything included in the lower tiers plus:
                </FnText>
              </div>
            </div>
            <hr />
          </div>
          <FnDescriptionList>
            {membershipPlan?.benefits?.map(item => {
              return (
                <FnDescriptionListItem
                  title={item.title}
                  description={item.description}
                />
              );
            })}
          </FnDescriptionList>
        </div>

        <FnText type="heading-xSmall" bold className={styles.dividerHeading}>
          The bottom line
        </FnText>

        <div className="mb-4">
          <TestimonialCard
            authorName={membershipPlan?.author}
            avatarUrl={`https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,h_400,w_400/g_south_east,l_fn_22_mw4cdy/v1/photos/upload-493.jpg`}
            quote={membershipPlan?.quote}
          />
        </div>
        {plan !== 'lifetime' && (
          <>
            <FnText
              type="heading-xSmall"
              bold
              className={styles.dividerHeading}
            >
              {activePlan}
            </FnText>

            <div
              className={clsx(
                styles.iconsContainer,
                isMobile && 'flex-column align-tems-center',
                isMobile && 'gap-4'
              )}
            >
              <div>
                <div className="d-flex justify-content-center">
                  <FnText
                    bold
                    type="heading-xl"
                  >{`$${membershipPlan?.price.toLocaleString()}`}</FnText>
                </div>
                {activePlan == 'Lifetime' ? (
                  <div className={clsx('text-end', isMobile && 'text-center')}>
                    one-time payment.
                  </div>
                ) : (
                  <div className={clsx('text-end', isMobile && 'text-center')}>
                    per year.
                  </div>
                )}
              </div>
              <div className={styles.iconContainer}>
                <Image
                  className={clsx(styles['priceIcon'], styles['iconStyles'])}
                  src={PercentIconSvg}
                  alt="Percentage"
                />
                <div>Keep your equity</div>
              </div>
              <div className={styles.iconContainer}>
                <Image
                  className={clsx(styles['priceIcon'], styles['iconStyles'])}
                  src={QuestionsIconSvg}
                  alt="Phone Call"
                />
                <div>Full Time Staff</div>
              </div>
              <div className={styles.iconContainer}>
                <Image
                  className={clsx(styles['priceIcon'], styles['iconStyles'])}
                  src={MailIconSvg}
                  alt="Mail"
                />
                <div>Over {CURRENT_FOUDNER_COUNT} Founders </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};
