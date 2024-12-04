import React, {SetStateAction} from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import {Modal} from 'react-bootstrap';
import modalStyles from '@/components/FunctionTickets/ReservationWidget/modalStyles.module.scss';
import classes from './selectTicketModal.module.scss';

import {
  ReservationModalTypes,
  ReservationSubModals,
  TicketInterface,
  WidgetDataInterface
} from '@/components/FunctionTickets/ReservationWidget/reservationWidget';
import {TicketItem} from '../TicketItem';
import {TicketCostTable} from '../TicketCostTable';
import {Spinner} from '@/ds/Spinner';
import {PAYMENT_PLAN} from '@/utils/common/constants';
import {Upgrade} from '@/components/Upgrade';
import {Button, ButtonVariants} from '@/ds/Button';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface SelectTicketModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  loading: boolean;
  widgetData: WidgetDataInterface;
  setWidgetData: React.Dispatch<SetStateAction<WidgetDataInterface>>;
  functionId: string;
  handleSubmit: () => void;
  submitting: boolean;
  handleClose: () => void;
  modalType?: ReservationModalTypes;
}
export const PAY_PLAN_TO_CLASS: {
  [key in PAYMENT_PLAN]: string;
} = {
  [PAYMENT_PLAN.BOOTSTRAP]: 'bootstrap',
  [PAYMENT_PLAN.ANGEL]: 'angel',
  [PAYMENT_PLAN.SERIES_A]: 'seriesA',
  [PAYMENT_PLAN.LIFETIME]: 'lifetime'
};

export const SelectTicketModal: React.FC<SelectTicketModalProps> = ({
  setVisibleModal,
  loading = false,
  widgetData,
  setWidgetData,
  functionId,
  handleSubmit,
  submitting,
  handleClose
}) => {
  const bookableTicketPresent = !!widgetData?.tickets?.length;
  const userPaymentPlan = useSelector(selectUserInfo())
    .paymentPlan as PAYMENT_PLAN;

  const updateTicket = (newTicket: TicketInterface) => {
    let totalCost = 0;
    const updatedWidgetData = {
      ...widgetData,
      tickets: widgetData.tickets.map(t => {
        if (newTicket.id === t.id) {
          totalCost += newTicket.selectedTicketsCost ?? 0;
          return {...t, ...newTicket};
        }
        totalCost += t.selectedTicketsCost ?? 0;
        return t;
      }),
      memberTicketSelected:
        newTicket?.memberTicketSelected ?? widgetData.memberTicketSelected,
      guestCount: newTicket?.guestCount ?? widgetData.guestCount,
      totalCost
    };
    setWidgetData(updatedWidgetData);
  };

  const handleClick = () => {
    if (widgetData.guestCount > 0) {
      setVisibleModal(ReservationSubModals.AddGuest);
    } else if (widgetData.totalCost) {
      setVisibleModal(ReservationSubModals.ConfirmTickets);
    } else {
      handleSubmit();
    }
  };

  const bookableTickets = bookableTicketPresent ? (
    widgetData.tickets.map(ticket => (
      <TicketItem
        key={ticket.id}
        ticket={ticket}
        updateTicket={updateTicket}
        className={clsx([
          classes.ticketContainer,
          ticket.numberOfGuest
            ? classes.guest
            : classes[PAY_PLAN_TO_CLASS[ticket?.plan ?? userPaymentPlan]]
        ])}
      />
    ))
  ) : (
    <div className="text-center mb-3 text-secondary">
      No tickets Available to Book
    </div>
  );

  const ticketInclusionsLink = (
    <Link href={`/function/${functionId}#tickets`} onClick={handleClose}>
      Whats included in the ticket?
    </Link>
  );

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
          Function Tickets
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
                <div className={classes.title}>Your Tickets</div>
                <div className={classes.container}>
                  {widgetData.bookedTickets.map(ticket => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      className={clsx([
                        classes.ticketContainer,
                        ticket.guestName
                          ? classes.guest
                          : classes[
                              PAY_PLAN_TO_CLASS[ticket?.plan ?? userPaymentPlan]
                            ]
                      ])}
                      selectable={false}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className={classes.section}>
              <div className={classes.title}>Select Tickets</div>
              <div className={classes.container}>{bookableTickets}</div>
            </div>
            <Upgrade
              paymentPlan={userPaymentPlan}
              className={classes.upgrade}
            />
          </div>
          <div
            className={clsx(
              classes.footer,
              !bookableTicketPresent &&
                'justify-content-center align-items-center'
            )}
          >
            {bookableTicketPresent ? (
              <>
                <TicketCostTable detailedMode={false} widgetData={widgetData} />
                <div className={classes.review}>
                  <Button
                    variant={ButtonVariants.BluePrimary}
                    className={modalStyles.btn1}
                    disabled={
                      widgetData.guestCount === 0 &&
                      (!widgetData.memberTicketSelected || submitting)
                    }
                    onClick={handleClick}
                    loadingChildren={'Submitting'}
                    loading={submitting}
                    textUppercase
                  >
                    {widgetData.guestCount > 0
                      ? "Add Guests' Info"
                      : (widgetData.totalCost && 'Review & Checkout') ||
                        'Submit'}
                  </Button>
                  {ticketInclusionsLink}
                </div>
              </>
            ) : (
              ticketInclusionsLink
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
