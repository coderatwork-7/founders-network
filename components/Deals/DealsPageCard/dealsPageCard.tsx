import clsx from 'clsx';
import classes from './dealsPageCard.module.scss';
import Card from '@/ds/Card/card';
import {Divider} from '@/ds/Divider';
import {Rating} from '@/ds/Rating';
import {useState} from 'react';
import {DEALS_MODALS, DealsModal} from '../DealsModals/dealsModal';
import {Button, ButtonVariants} from '@/ds/Button';
import {CardBadges} from '@/ds/FunctionCard/components/cardBadges';
import Link from 'next/link';

import {LAUNCH, LEAD, LIFETIME, SCALE} from '@/utils/common/constants';
import {IDeal} from '@/utils/interfaces/deal';

interface DealsPageCardProps {
  deal: IDeal;
  isMobile?: boolean;
  selectedTab: string;
  plan: string;
}
const badgeIcons = ['Bootstrap', 'Angel', 'Series-A+', 'Lifetime'];
const badges = [LAUNCH, SCALE, LEAD, LIFETIME];
const badgeColors = ['', 'brownColor', 'purpleColor', 'greenColor'];

export function DealsPageCard({
  deal,
  isMobile = false,
  selectedTab,
  plan
}: DealsPageCardProps) {
  const {
    id,
    imgSrc,
    title,
    value,
    isRedeemed,
    isRatedByUser,
    isFeatured,
    rating,
    upgradeNeeded
  } = deal;

  const [showDealsModal, setShowDealsModal] = useState(false);
  let headingText = isFeatured ? 'FEATURED' : '';

  if (isRedeemed)
    headingText = headingText + (isFeatured ? ' AND REDEEMED' : '');

  const renderFooter = () => {
    if (upgradeNeeded)
      return (
        <div
          className={clsx(
            classes.footerContent,
            'text-center',
            selectedTab === LAUNCH && 'mt-3'
          )}
        >
          {!!selectedTab && (
            <CardBadges
              badgeName={selectedTab}
              hrefLink={`/raise?stage=${selectedTab}`}
            />
          )}
          <Link
            href={`/raise?stage=${selectedTab}`}
            className={clsx(classes.LinkWidth)}
          >
            <Button
              variant={ButtonVariants.Primary}
              subVariant="verySmall"
              className="w-100 mt-1"
              colorClass={selectedTab}
            >
              Upgrade to access
            </Button>
          </Link>
        </div>
      );
    if (isRedeemed) {
      if (isRatedByUser)
        return (
          <Rating
            onClick={() => undefined}
            rating={rating}
            staticDisplay={true}
            ratingTextClass={classes.ratingText}
            size={30}
            className="mt-2"
          />
        );
      else
        return (
          <div className="text-center mt-1">
            <Rating
              onClick={() => undefined}
              rating={1}
              staticDisplay={true}
              ratingTextClass="d-none"
              size={36}
              iconsCount={1}
              SVGstrokeColor="#466cc3"
              fillColor="#466cc3"
            />
            <Button
              variant={ButtonVariants.Primary}
              subVariant="verySmall"
              className="w-100 mt-1"
              colorClass="blueColor"
            >
              Rate this deal
            </Button>
          </div>
        );
    }
    return (
      <Rating
        onClick={() => undefined}
        rating={rating}
        staticDisplay={true}
        ratingTextClass={classes.ratingText}
        size={30}
        className="mt-2"
      />
    );
  };
  return (
    <Card
      className={clsx(
        classes.container,
        //isRedeemed && classes.bgDark,
        isMobile && 'w-100'
      )}
    >
      <div
        className={clsx(
          classes.featuredHeight,
          isFeatured && classes.featuredText
        )}
      >
        {headingText}
      </div>
      <div
        className={clsx(
          classes.banner,
          'd-flex justify-content-center align-items-center p-4'
        )}
      >
        <img src={imgSrc} alt="deal provider" />
      </div>
      <Divider className="m-0" />
      <div
        className={clsx('p-2 cursorPointer')}
        onClick={() => setShowDealsModal(true)}
      >
        <div className={clsx(classes.title, 'px-2 cursorPointer')}>{title}</div>
        <div
          className={clsx(
            classes.savings,
            'd-flex justify-content-center align-items-center'
          )}
        >{`Save upto $${value}`}</div>
      </div>

      <Divider className="m-0" />
      <div
        className="p-2 cursorPointer"
        onClick={upgradeNeeded ? undefined : () => setShowDealsModal(true)}
      >
        {renderFooter()}
      </div>

      {showDealsModal && (
        <DealsModal
          dealId={`${id}`}
          handleClose={() => setShowDealsModal(false)}
          modal={
            isRedeemed ? DEALS_MODALS.RatingModal : DEALS_MODALS.RedeemModal
          }
          upgradeNeeded={upgradeNeeded}
          plan={plan}
        />
      )}
    </Card>
  );
}
