import React, {useEffect, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectDeal, selectUserInfo} from '@/store/selectors';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {CanceledError} from 'axios';
import {RatingModal} from './RatingModals/ratingModal';
import {RedeemModal} from './RedeemModals/RedeemModal';
import {DEALS_MODAL_INFO_MAP} from '@/utils/common/apiToStoreMaps';
import {convertObjectUsingReverseMapping} from '@/utils/common/helper';

export enum DEALS_MODALS {
  None,
  RatingModal,
  RedeemModal
}

export interface DealInfoInterface {
  company: {
    logo: string;
    name: string;
    description: string;
    site: string;
  };
  offer: string;
  tags: Array<{id: number; name: string}>;
  userRating: number;
  improve: {[tag: string]: boolean};
  improveText: string;
}

interface DealsModalProps {
  dealId: string;
  handleClose: () => void;
  modal: DEALS_MODALS.RatingModal | DEALS_MODALS.RedeemModal;
  upgradeNeeded: boolean; // Add this line
  plan: string;
}

export const DealsModal: React.FC<DealsModalProps> = ({
  handleClose,
  dealId,
  modal,
  upgradeNeeded,
  plan
}) => {
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const dealInfo = convertObjectUsingReverseMapping(
    useSelector(selectDeal(dealId)) ?? {},
    DEALS_MODAL_INFO_MAP
  ) as DealInfoInterface;
  const loading = useSelector(selectApiState('getDealInfo'));
  const [visibleModal, setVisibleModal] = useState<DEALS_MODALS>(modal);

  useEffect(() => {
    if (!dealInfo?.improve) {
      api(
        'getDealInfo',
        {
          userId: userInfo?.id,
          dealId,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        },
        {}
      ).catch(err => {
        if (!(err.errorObj instanceof CanceledError))
          setVisibleModal(DEALS_MODALS.None);
      });
    }
  }, []);

  if (visibleModal === DEALS_MODALS.None) handleClose();

  return (
    <div>
      {visibleModal === DEALS_MODALS.RedeemModal && (
        <RedeemModal
          setVisibleModal={setVisibleModal}
          dealId={dealId}
          dealInfo={dealInfo}
          loading={loading}
          upgradeNeeded={upgradeNeeded}
          plan={plan}
        />
      )}
      {visibleModal === DEALS_MODALS.RatingModal && (
        <RatingModal
          setVisibleModal={setVisibleModal}
          dealId={dealId}
          dealInfo={dealInfo}
          loading={loading}
        />
      )}
    </div>
  );
};
