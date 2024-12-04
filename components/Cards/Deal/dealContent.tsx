import classes from './dealContent.module.scss';
import Link from 'next/link';
import React, {useCallback, useState} from 'react';
import {Button} from '@/ds/Button';
import {ButtonVariants} from '@/ds/Button/button';
import {
  DEALS_MODALS,
  DealsModal
} from '@/components/Deals/DealsModals/dealsModal';
interface DealContentProps {
  dealId: string;
  dealProvider: string;
  details: string;
  image: string;
  allowedTo: string[];
  allowed: boolean;
  value: number;
  isRedeemed: boolean;
  plan: string;
}
export default function DealContent({
  dealId,
  dealProvider,
  details,
  image,
  allowed,
  allowedTo,
  value,
  isRedeemed,
  plan
}: DealContentProps): JSX.Element {
  const [showDealsModal, setShowDealsModal] = useState(false);
  const handleRedeemClick = useCallback(() => {
    setShowDealsModal(true);
  }, []);
  return (
    <>
      <div className={classes.imageContainer}>
        {/*TODO:maybe replace with next Image*/}
        <img src={image} alt={dealProvider}></img>
        <div className="w-100">
          <Link href="/deals" className={classes.info}>
            {details}
          </Link>
          <div className={classes.deal}>{dealProvider}</div>
          {!allowed && (
            <div className={classes.lock}>
              This deal is only available to{' '}
              {allowedTo.map((level, i) => (
                <React.Fragment key={level}>
                  {i ? ', ' + level : level}
                </React.Fragment>
              ))}
              {' Members'}.<Link href="/raise"> Learn more</Link>
            </div>
          )}

          {allowed && (
            <div className={classes.displayDealOffer}>
              {`Save $${value}`}
              <Button
                onClick={handleRedeemClick}
                variant={ButtonVariants.SquarePrimary}
              >
                {isRedeemed ? 'RATE DEAL' : 'REDEEM'}
              </Button>
            </div>
          )}
        </div>
      </div>
      {showDealsModal && (
        <DealsModal
          plan={plan}
          dealId={dealId}
          handleClose={() => setShowDealsModal(false)}
          upgradeNeeded={false}
          modal={
            isRedeemed ? DEALS_MODALS.RatingModal : DEALS_MODALS.RedeemModal
          }
        />
      )}
    </>
  );
}
