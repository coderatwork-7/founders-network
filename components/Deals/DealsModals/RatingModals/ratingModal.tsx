import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import modalStyles from '@/components/Deals/DealsModals/modalStyles.module.scss';
import classes from './ratingModal.module.scss';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import {DEALS_MODALS, DealInfoInterface} from '../dealsModal';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import Image from 'next/image';
import {Rating, RatingTextPos} from '@/ds/Rating';
import {Tag} from '@/ds/Tag';
import clsx from 'clsx';
import {RATING_CONFIG, TAG_LABELS} from './configs';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';

interface RatingModalProps {
  setVisibleModal: (modal: DEALS_MODALS) => void;
  dealInfo: DealInfoInterface | null;
  dealId: string;
  loading: boolean;
}

interface RateDealProps {
  dealId: string;
  dealInfo: DealInfoInterface | null;
  setRated: (v: boolean) => void;
}

interface RateData {
  rating: number;
  improve: DealInfoInterface['improve'];
  improveComment?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  setVisibleModal,
  dealId,
  dealInfo,
  loading
}) => {
  const [rated, setRated] = useState(false);

  return (
    <Modal
      show={true}
      onHide={() => setVisibleModal(DEALS_MODALS.None)}
      animation={false}
      centered
      dialogClassName={modalStyles.modal}
      contentClassName={clsx([
        modalStyles.content,
        rated && modalStyles.contentAlert
      ])}
    >
      <button
        className="btn-close mt-3 me-3 position-absolute end-0"
        onClick={() => setVisibleModal(DEALS_MODALS.None)}
      />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center flex-fill">
          <Spinner />
        </div>
      ) : (
        <>
          {!rated && (
            <RateDeal dealId={dealId} dealInfo={dealInfo} setRated={setRated} />
          )}
          {rated && (
            <div
              className={clsx([
                modalStyles.title,
                'd-flex justify-content-center align-items-center flex-fill mx-5'
              ])}
            >
              Your rating has been submitted!
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

const RateDeal: React.FC<RateDealProps> = ({dealInfo, dealId, setRated}) => {
  const [rating, setRating] = useState<number>(
    Math.floor(dealInfo?.userRating ?? 0)
  );
  const [err, setErr] = useState('');
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const sending = !!useSelector(selectApiState('postRateDeal'));
  const [tagsState, setTagsState] = useState<{[tag: string]: boolean}>(
    dealInfo?.improve ?? {}
  );
  const [improveComment, setImproveComment] = useState(
    dealInfo?.improveText ?? ''
  );

  const handleRatingChange = (val: number) => {
    if (val !== rating) {
      setRating(val);
    }
  };

  const handleSubmitRating = () => {
    const data: RateData = {
      rating,
      improve: RATING_CONFIG[rating].tags.reduce((allTags, tag) => {
        allTags[tag] = tagsState[tag] ?? false;
        return allTags;
      }, {} as RateData['improve'])
    };

    if (tagsState.other) data.improveComment = improveComment;

    setErr('');
    api(
      'postRateDeal',
      {
        userId: userInfo?.id,
        dealId,
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      },
      {method: 'POST', data}
    )
      .then(() => {
        setRated(true);
      })
      .catch(() => {
        setErr('Error Submitting Ratings');
      });
  };

  return (
    <>
      <div className={clsx([modalStyles.modalSection, 'mb-0'])}>
        <div className={modalStyles.logoContainer}>
          <Image
            height={500}
            width={500}
            src={dealInfo?.company.logo ?? ''}
            alt="company_logo"
            className={modalStyles.logo}
          />
        </div>
        <div className={clsx([modalStyles.title, 'text-center my-4'])}>
          <span> {dealInfo?.offer}</span>
        </div>
        <Rating
          onClick={handleRatingChange}
          rating={rating}
          size={48}
          ratingTextPosition={RatingTextPos.Top}
          containerClass="align-items-center"
        />
      </div>

      <div className={modalStyles.modalSection}>
        <div className={classes.tagContainer}>
          <div className={classes.msg}>{RATING_CONFIG[rating].msg}</div>
          <div className={clsx([modalStyles.tags, 'justify-content-center'])}>
            {RATING_CONFIG[rating].tags.map(tag => (
              <Tag
                key={tag}
                defaultSelected={tagsState[tag]}
                selectable
                onClick={selected =>
                  setTagsState(prevTags => ({...prevTags, [tag]: selected}))
                }
              >
                {TAG_LABELS[tag]}
              </Tag>
            ))}
            {!!tagsState.other && (
              <input
                type="text"
                placeholder="Other Reason"
                value={improveComment}
                onChange={e => setImproveComment(e.target.value)}
                className={classes.reasonInput}
              />
            )}
          </div>
        </div>
        <div className="text-center">
          <Button
            variant={ButtonVariants.BluePrimary}
            className={modalStyles.btn}
            disabled={sending}
            onClick={handleSubmitRating}
            loading={sending}
            loadingChildren={'Submitting'}
            textUppercase
          >
            Submit
          </Button>
          {!!err && <div className="text-danger">{err}</div>}
        </div>
      </div>
    </>
  );
};
