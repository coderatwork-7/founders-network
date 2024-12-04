import React, {SetStateAction, useState} from 'react';
import clsx from 'clsx';
import {Modal} from 'react-bootstrap';
import modalStyles from '@/components/FunctionTickets/ReservationWidget/modalStyles.module.scss';
import classes from './selectTicketModal.module.scss';

import {
  BookedTicketInterface,
  ReservationModalTypes,
  ReservationSubModals,
  WidgetDataInterface
} from '@/components/FunctionTickets/ReservationWidget/reservationWidget';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import {PAY_PLAN_TO_CLASS} from './selectTicketModal';
import {PAYMENT_PLAN} from '@/utils/common/constants';
import {TicketItem} from '../TicketItem';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface RemoveTicketModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  loading: boolean;
  widgetData: WidgetDataInterface;
  setWidgetData: React.Dispatch<SetStateAction<WidgetDataInterface>>;
  handleClose: () => void;
  setTicketsToRemove: React.Dispatch<
    React.SetStateAction<BookedTicketInterface[]>
  >;
}

const checkedTicketsCount = (widgetData: WidgetDataInterface) => {
  return widgetData.bookedTickets.reduce(
    (count, ticket) => count + +(ticket?.checked ?? 0),
    0
  );
};

const getTicketsToRemove = (widgetData: WidgetDataInterface) => {
  return widgetData.bookedTickets.filter(t => t?.checked);
};

const updateTicketCheck = (
  id: number,
  check: boolean,
  widgetData: WidgetDataInterface
) => {
  return {
    ...widgetData,
    bookedTickets: widgetData.bookedTickets.map(t => ({
      ...t,
      checked: t.id === id ? check : t.checked
    }))
  };
};

export const RemoveTicketModal: React.FC<RemoveTicketModalProps> = ({
  setVisibleModal,
  loading = false,
  widgetData,
  setWidgetData,
  handleClose,
  setTicketsToRemove
}) => {
  const userPaymentPlan = useSelector(selectUserInfo())
    .paymentPlan as PAYMENT_PLAN;

  const [removeCount, setRemoveCount] = useState(
    checkedTicketsCount(widgetData)
  );

  const handleTicketSelectChange = (id: number, checked: boolean) => {
    setWidgetData(prevWidgetData =>
      updateTicketCheck(id, checked, prevWidgetData)
    );
    setRemoveCount(count => count + (checked ? 1 : -1));
  };

  const handleRemoveClick = () => {
    setTicketsToRemove(getTicketsToRemove(widgetData));
    setVisibleModal(ReservationSubModals.ConfirmRemoveTicket);
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
          Cancel Your Tickets
        </Modal.Title>
      </Modal.Header>
      {loading ? (
        <div className="d-flex justify-content-center mb-5  py-5">
          <Spinner />
        </div>
      ) : (
        <>
          <div className={classes.content}>
            {!!widgetData.bookedTickets.length && (
              <div className={classes.section}>
                <div className={clsx(classes.container, 'border-0')}>
                  <div className={classes.ticketHeader}>
                    <div>Ticket</div>
                    <div>Type</div>
                    <div>Select</div>
                  </div>
                  {widgetData.bookedTickets.map(ticket => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      className={clsx([
                        classes.ticketContainer,
                        ticket.checked && classes.checked,
                        ticket.guestName
                          ? classes.guest
                          : classes[
                              PAY_PLAN_TO_CLASS[ticket?.plan ?? userPaymentPlan]
                            ],
                        'ps-2'
                      ])}
                      selectable={false}
                      removable
                      onSelectChange={handleTicketSelectChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={clsx(classes.footer, 'justify-content-end')}>
            <div className={classes.review}>
              <Button
                variant={ButtonVariants.BluePrimary}
                className={modalStyles.btn1}
                disabled={removeCount === 0}
                onClick={handleRemoveClick}
                textUppercase
              >
                Confirm Selection ({removeCount})
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
