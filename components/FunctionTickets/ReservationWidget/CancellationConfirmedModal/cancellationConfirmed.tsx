import React from 'react';
import classes from './cancellationConfirmed.module.scss';
import modalStyles from '../modalStyles.module.scss';
import {ReservationSubModals} from '../reservationWidget';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {usePathname, useRouter} from 'next/navigation';
import {PAGES} from '@/utils/common/constants';

interface CancellationConfirmedModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  handleClose: () => void;
}

export const CancellationConfirmedModal: React.FC<
  CancellationConfirmedModalProps
> = ({handleClose}) => {
  const currentPage = usePathname();
  const router = useRouter();
  const handleClick = () => {
    if (currentPage === PAGES.FUNCTIONS) handleClose();
    router.push(PAGES.FUNCTIONS);
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      animation={false}
      centered
      dialogClassName={clsx([modalStyles.modal, classes.modal])}
      contentClassName={clsx([modalStyles.content, classes.content])}
    >
      <Modal.Header closeButton className="pt-3 pb-2 border-0">
        <Modal.Title
          className={clsx([modalStyles.modalTitle, 'text-truncate'])}
        >
          Tickets Cancelled
        </Modal.Title>
      </Modal.Header>
      <div className="fs-6 text-center px-4 mt-2 mb-3">
        Tickets Successfully cancelled
      </div>
      <div className={clsx(modalStyles.btnConatiner, 'justify-content-center')}>
        <Button
          variant={ButtonVariants.BluePrimary}
          className={modalStyles.btnResponsive}
          onClick={handleClick}
          textUppercase
        >
          Browse Upcoming Functions
        </Button>
      </div>
    </Modal>
  );
};
