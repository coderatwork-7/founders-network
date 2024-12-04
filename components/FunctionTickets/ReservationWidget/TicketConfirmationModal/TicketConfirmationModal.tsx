import React, {useState} from 'react';
import classes from './TicketConfirmationModal.module.scss';
import modalStyles from '../modalStyles.module.scss';
import {ReservationSubModals, WidgetDataInterface} from '../reservationWidget';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {TicketCostTable} from '../TicketCostTable';
import {CardInfo} from '../CardInfo';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';
import {Button, ButtonVariants} from '@/ds/Button';

interface TicketConfirmationModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  widgetData: WidgetDataInterface;
  handleSubmit: () => void;
  submitting: boolean;
  handleClose: () => void;
}

export const TicketConfirmationModal: React.FC<
  TicketConfirmationModalProps
> = ({setVisibleModal, widgetData, handleSubmit, submitting, handleClose}) => {
  const [editing, setEditing] = useState(false);
  const loading = !!useSelector(selectApiState('creditCardInfo'));

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
          Confirm Tickets
        </Modal.Title>
      </Modal.Header>
      <TicketCostTable detailedMode={true} widgetData={widgetData} />
      <CardInfo editing={editing} setEditing={setEditing} loading={loading} />
      <div className={classes.disclaimer}>No Refunds, No Transfers</div>
      <div className={modalStyles.btnConatiner}>
        <Button
          variant={ButtonVariants.BluePrimary}
          className={modalStyles.btnResponsive}
          onClick={() => {
            setVisibleModal(
              widgetData.guestCount
                ? ReservationSubModals.AddGuest
                : ReservationSubModals.SelectTicket
            );
          }}
          textUppercase
        >
          Back
        </Button>
        <Button
          type="submit"
          variant={ButtonVariants.BluePrimary}
          className={modalStyles.btnResponsive}
          disabled={editing || loading || submitting}
          onClick={() => {
            handleSubmit();
          }}
          loadingChildren={'Submitting'}
          loading={submitting}
          textUppercase
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};
