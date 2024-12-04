import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import classes from './nominationWidget.module.scss';
import useAPI from '@/utils/common/useAPI';
import {Spinner} from '@/ds/Spinner';
import {
  selectApiState,
  selectNominationInfo,
  selectUserInfo
} from '@/store/selectors';
import {
  FeedbackAckModal,
  FeedbackModal,
  QuickNominateModal,
  RequestAckModal
} from './Modals';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfinity} from '@fortawesome/free-solid-svg-icons';
import {NOMINATIONS_INFINTIE} from '@/utils/common/constants';

export enum NominationModals {
  None,
  NominationForm,
  FeedbackForm,
  FeedbackAck,
  RequestAck
}

export const NominationWidget: React.FC = () => {
  const api = useAPI();
  const data = useSelector(selectNominationInfo());
  const [nominee, setNominee] = useState('');
  const requesting = useSelector(selectApiState('postNominationsRequest'));
  const loading = !!useSelector(selectApiState('getNominationInfo'));
  const userInfo = useSelector(selectUserInfo());
  let {
    remainingDays,
    remainingNominations,
    cohort,
    requestedNomination,
    nominationReviewDate
  } = data || {};

  const isInfinteNomination = remainingNominations === NOMINATIONS_INFINTIE;
  const [visibleModal, setVisibleModal] = useState<NominationModals>(
    NominationModals.None
  );

  const handleNominationRequest = useCallback(() => {
    api(
      'postNominationsRequest',
      {userId: userInfo?.id ?? ''},
      {method: 'POST'}
    ).then(() => setVisibleModal(NominationModals.RequestAck));
  }, [api]);

  const nominationHandler = useCallback(() => {
    setVisibleModal(NominationModals.NominationForm);
  }, []);

  useEffect(() => {
    const fetchNominationDetails = async () => {
      await api('getNominationInfo', {
        userId: userInfo?.id ?? '',
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      });
    };

    if (!nominationReviewDate && userInfo?.id) {
      fetchNominationDetails();
    }
  }, [userInfo?.id]);

  return (
    <div className={clsx(classes.container, 'container-border')}>
      {loading || nominationReviewDate === undefined ? (
        <div className={classes.spinner}>
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <div className={classes.info}>
            <div className={classes.label}>Nomination Deadline</div>
            <div className={clsx([classes.value, loading && 'fs-6'])}>
              {remainingDays || '-'}
            </div>
          </div>
          <div className={classes.info}>
            <div className={classes.label}>Remaining Nominations</div>
            <div className={clsx([classes.value, loading && 'fs-6'])}>
              {isInfinteNomination ? (
                <FontAwesomeIcon icon={faInfinity} />
              ) : (
                remainingNominations
              )}
            </div>
          </div>
          <div className="p-2">
            {remainingNominations === 0 ? (
              <Button
                variant={ButtonVariants.Tertiary}
                disabled={requestedNomination}
                className={clsx(classes.btn)}
                onClick={handleNominationRequest}
                loading={requesting}
                loadingChildren={'Requesting'}
              >
                {requestedNomination ? 'Request Sent' : 'Request More'}
              </Button>
            ) : (
              <Button
                variant={ButtonVariants.Tertiary}
                className={clsx(classes.btn)}
                disabled={loading}
                onClick={nominationHandler}
              >
                Quick Nomination
              </Button>
            )}
          </div>
          {visibleModal === NominationModals.NominationForm && (
            <QuickNominateModal
              setVisibleModal={setVisibleModal}
              setNominee={setNominee}
              remainingDays={remainingDays}
              cohort={cohort}
            />
          )}
          {visibleModal === NominationModals.FeedbackForm && (
            <FeedbackModal
              nominee={nominee}
              setVisibleModal={setVisibleModal}
            />
          )}
          {visibleModal === NominationModals.FeedbackAck && (
            <FeedbackAckModal setVisibleModal={setVisibleModal} />
          )}
          {visibleModal === NominationModals.RequestAck && (
            <RequestAckModal
              setVisibleModal={setVisibleModal}
              reviewDate={nominationReviewDate}
            />
          )}
        </>
      )}
    </div>
  );
};
