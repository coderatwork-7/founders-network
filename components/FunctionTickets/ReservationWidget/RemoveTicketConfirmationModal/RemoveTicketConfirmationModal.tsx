import React from 'react';
import clsx from 'clsx';
import {Modal} from 'react-bootstrap';
import modalStyles from '@/components/FunctionTickets/ReservationWidget/modalStyles.module.scss';
import classes from '../SelectTicketModal/selectTicketModal.module.scss';

import {
  BookedTicketInterface,
  ReservationSubModals
} from '@/components/FunctionTickets/ReservationWidget/reservationWidget';
import {Button, ButtonVariants} from '@/ds/Button';
import {TicketItem} from '../TicketItem';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';

interface RemoveTicketConfirmationModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  handleClose: () => void;
  ticketsToRemove: BookedTicketInterface[];
  handleRemove: () => Promise<any>;
}

export const RemoveTicketConfirmationModal: React.FC<
  RemoveTicketConfirmationModalProps
> = ({setVisibleModal, handleClose, ticketsToRemove, handleRemove}) => {
  const loading = useSelector(selectApiState('postRemoveTickets'));

  const handleRemoveClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    handleRemove().then(() =>
      setVisibleModal(ReservationSubModals.RemoveConfirmed)
    );
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      animation={false}
      centered
      dialogClassName={modalStyles.modal}
      contentClassName={modalStyles.content}
    >
      <Modal.Header closeButton className="pt-3 pb-2 border-0">
        <Modal.Title
          className={clsx([modalStyles.modalTitle, 'text-truncate'])}
        >
          Confirm Your Choice
        </Modal.Title>
      </Modal.Header>
      <div className={classes.content}>
        <div className={classes.section}>
          <div className={clsx(classes.container, 'border-0')}>
            <div className="text-center mt-2 mb-4 fs-6">
              Are you sure that you would like to cancel the following -
            </div>
            {ticketsToRemove.map(ticket => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                className={clsx(classes.ticketContainer, classes.removeTicket)}
                selectable={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={modalStyles.btnConatiner}>
        <Button
          variant={ButtonVariants.BluePrimary}
          className={modalStyles.btnResponsive}
          onClick={() => {
            setVisibleModal(ReservationSubModals.RemoveTicket);
          }}
          textUppercase
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant={ButtonVariants.BluePrimary}
          className={modalStyles.btnResponsive}
          disabled={loading}
          onClick={handleRemoveClick}
          loadingChildren={'Cancelling'}
          loading={loading}
          textUppercase
        >
          Cancel Tickets
        </Button>
      </div>
    </Modal>
  );
};
