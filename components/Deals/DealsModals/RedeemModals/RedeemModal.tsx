import React, {useState, useEffect} from 'react';
import {Modal} from 'react-bootstrap';
import modalStyles from '@/components/Deals/DealsModals/modalStyles.module.scss';
import classes from './RedeemModal.module.scss';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import {DEALS_MODALS, DealInfoInterface} from '../dealsModal';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import Image from 'next/image';
import {Rating} from '@/ds/Rating';
import {Tag} from '@/ds/Tag';
import Parse from 'html-react-parser';
import Link from 'next/link';
import clsx from 'clsx';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {processAnchorTagAndEmoji} from '@/utils/common/help';
import RedeemCard from '@/ds/RedeemCard/RedeemCard';

interface RedeemModalProps {
  setVisibleModal: (modal: DEALS_MODALS) => void;
  dealInfo: DealInfoInterface | null;
  dealId: string;
  loading: boolean;
  upgradeNeeded: boolean;
  plan: string;
}

interface RedeemData {
  successMessage: string;
  instructions: string;
  savingsMessage: string;
}

interface RedeemProps {
  dealId: string;
  dealInfo: DealInfoInterface | null;
  setRedeemData: (v: RedeemData) => void;
  upgradeNeeded: boolean;
  plan: string;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  setVisibleModal,
  dealId,
  dealInfo,
  loading,
  upgradeNeeded,
  plan
}) => {
  const [redeemData, setRedeemData] = useState<RedeemData | null>(null);

  return (
    <Modal
      show={true}
      onHide={() => setVisibleModal(DEALS_MODALS.None)}
      animation={false}
      centered
      dialogClassName={modalStyles.modal}
      contentClassName={modalStyles.content}
    >
      <button
        className="btn-close mt-3 me-3 position-absolute end-0"
        onClick={() => setVisibleModal(DEALS_MODALS.None)}
      />
      {loading || !dealInfo?.improve ? (
        <div className="d-flex justify-content-center align-items-center flex-fill">
          <Spinner />
        </div>
      ) : (
        <div className={classes.container}>
          <div
            className={clsx(
              modalStyles.modalSection,
              modalStyles.logoContainer
            )}
          >
            <Image
              height={500}
              width={500}
              src={dealInfo?.company.logo ?? ''}
              alt="company_logo"
              className={modalStyles.logo}
            />
          </div>
          {redeemData ? (
            <RedeemSuccess data={redeemData} dealInfo={dealInfo} />
          ) : (
            <Redeem
              dealInfo={dealInfo}
              dealId={dealId}
              setRedeemData={setRedeemData}
              upgradeNeeded={upgradeNeeded}
              plan={plan}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

const Redeem: React.FC<RedeemProps> = ({
  dealInfo,
  dealId,
  setRedeemData,
  upgradeNeeded,
  plan
}) => {
  const [rating, setRating] = useState<number>(
    Math.floor(dealInfo?.userRating ?? 0)
  );
  const [err, setErr] = useState('');
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const processing = !!useSelector(selectApiState('postRedeemDeal'));
  const {paymentPlan} = useSelector(selectUserInfo()) || {};
  const [selectedTab, setSelectedTab] = useState(0);

  const handleRatingChange = (val: number) => {
    if (val !== rating) {
      setRating(val);
      api(
        'postRateDeal',
        {
          userId: userInfo?.id,
          dealId,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        },
        {method: 'POST', data: {rating: val}}
      );
    }
  };

  const handleRedeem = () => {
    setErr('');
    api(
      'postRedeemDeal',
      {
        userId: userInfo?.id,
        dealId,
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      },
      {method: 'POST'}
    )
      .then(res => {
        setRedeemData(res.data);
      })
      .catch(() => {
        setErr('Error Redeeming Deal');
      });
  };

  useEffect(() => {
    const storedValue =
      typeof window !== 'undefined'
        ? localStorage.getItem('selectedTab')
        : null;
    setSelectedTab(storedValue ? parseInt(storedValue, 10) : 0);
  }, []);

  return (
    <>
      <div className={modalStyles.modalBody}>
        <div className={modalStyles.title}>
          <span> {dealInfo?.offer}</span>
          <span>from </span>
          <a href={dealInfo?.company.site ?? ''} target="_blank">
            {dealInfo?.company.name}
          </a>
        </div>

        <Rating
          onClick={handleRatingChange}
          rating={rating}
          showNumWithText={true}
        />
        <div className={classes.description}>
          {dealInfo?.company.description}
        </div>
      </div>

      <div className={modalStyles.modalSection}>
        <div className={modalStyles.tags}>
          {dealInfo?.tags.map(tag => (
            <Tag key={tag.id} defaultSelected>
              {tag.name}
            </Tag>
          ))}
        </div>
        <div className="text-center mb-2">
          {paymentPlan === 'Launch' || upgradeNeeded ? (
            <RedeemCard plan={plan} />
          ) : (
            <>
              <Button
                variant={ButtonVariants.BluePrimary}
                className={modalStyles.btn}
                disabled={processing}
                onClick={handleRedeem}
                loading={processing}
                loadingChildren={'Redeeming'}
                textUppercase
              >
                Redeem
              </Button>
              {!!err && <div className="text-danger">{err}</div>}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const RedeemSuccess: React.FC<{
  data: RedeemData;
  dealInfo: DealInfoInterface | null;
}> = ({data, dealInfo}) => {
  return (
    <>
      <div className={clsx([modalStyles.modalBody, classes.succcessModalBody])}>
        <div className={modalStyles.title}>
          <span>Success! You redeemed </span>
          <span> {dealInfo?.offer}</span>
          <span>from </span>
          <a href={dealInfo?.company.site ?? ''} target="_blank">
            {dealInfo?.company.name}
          </a>
        </div>
        <div className={clsx([classes.description, 'mt-3'])}>
          {Parse(data.instructions, {
            replace: processAnchorTagAndEmoji
          })}
        </div>
      </div>
      <div className={modalStyles.modalSection}>
        <div className={classes.savings}>{data.savingsMessage}</div>
        <Link href="/deals" className={classes.seeMoreLink}>
          See More fnDeals
        </Link>
      </div>
    </>
  );
};
