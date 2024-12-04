import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SelectTicketModal} from './SelectTicketModal/selectTicketModal';
import {AddGuestsModal} from './AddGuestsModal/addGuestsModal';
import {TicketConfirmationModal} from './TicketConfirmationModal/TicketConfirmationModal';
import {ReservationConfirmedModal} from './ReservationConfirmedModal/reservationConfirmed';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {CanceledError} from 'axios';
import {useSelector} from 'react-redux';
import {
  selectApiState,
  selectFunctionTicketInfo,
  selectUserInfo
} from '@/store/selectors';
import {RemoveTicketModal} from './SelectTicketModal/removeTicketModal';
import {PAYMENT_PLAN} from '@/utils/common/constants';
import {RemoveTicketConfirmationModal} from './RemoveTicketConfirmationModal/RemoveTicketConfirmationModal';
import {CancellationConfirmedModal} from './CancellationConfirmedModal/cancellationConfirmed';
import {toast} from 'react-toastify';

export enum ReservationSubModals {
  None,
  SelectTicket,
  RemoveTicket,
  AddGuest,
  ConfirmTickets,
  ReserveationConfirmed,
  ConfirmRemoveTicket,
  RemoveConfirmed
}

export enum ReservationModalTypes {
  None,
  BookTickets,
  AddTickets,
  RemoveTickets
}

export interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  isNominated: boolean;
  error?: string;
}

export interface WidgetDataInterface {
  credits: number;
  bookedTickets: Array<BookedTicketInterface>;
  tickets: Array<TicketInterface>;
  guestCount: number;
  memberTicketSelected: boolean;
  totalCost: number;
}

export interface TicketInterface {
  id?: number;
  name?: string;
  type?: string;
  dialInSlots?: Array<string>;
  price?: number;
  numberOfGuest?: number;
  memberTicketSelected?: boolean;
  guestCount?: number;
  selectedSlot?: string;
  selectedTicketsCost?: number;
  guestName?: string;
  checked?: boolean;
  plan?: PAYMENT_PLAN;
}

export interface BookedTicketInterface {
  id?: number;
  name?: string;
  price?: number;
  type?: string;
  guestName?: string;
  checked?: boolean;
  plan?: PAYMENT_PLAN;
}

interface PostDataInterface {
  name: string;
  type: string;
  dialInSlot: string;
  price: number;
  numberOfGuest: number;
  guestDetails: Array<Guest>;
}
interface ReservationWidgetProps {
  handleClose: () => void;
  functionId: string;
  modalType?: ReservationModalTypes;
}

const processTickets = (
  tickets: TicketInterface[] | BookedTicketInterface[],
  useIndexAsId: boolean,
  addCheckedField: boolean = false
) => {
  return tickets?.map((t, index) => ({
    ...t,
    ...(useIndexAsId && {id: index}),
    price: +(t.price?.toString()?.replace('$', '') ?? 0),
    ...(addCheckedField && {checked: false})
  }));
};

const defaultSelectTicket = (ticketsArr: TicketInterface[]) => {
  const tickets = [...ticketsArr];
  const updates = {
    updatedTickets: tickets,
    memberTicketSelected: false,
    totalCost: 0
  };

  const index = tickets.findIndex(ticket => ticket.numberOfGuest === 0);
  if (index !== -1) {
    tickets[index].memberTicketSelected = true;
    tickets[index].selectedTicketsCost = tickets[index].price;
    updates.memberTicketSelected = true;
    updates.totalCost = tickets[index].price ?? 0;
  }

  return updates;
};

export const getUpdatedGuestData = (
  prevGuestData: Guest[],
  guestData?: Guest[]
) => {
  return prevGuestData.map((guest, index) => ({
    ...guest,
    error: guestData?.[index].error ?? false
  }));
};

export const ReservationWidget: React.FC<ReservationWidgetProps> = ({
  handleClose,
  functionId,
  modalType = ReservationModalTypes.BookTickets
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [visibleModal, setVisibleModal] = useState<ReservationSubModals>(
    modalType === ReservationModalTypes.RemoveTickets
      ? ReservationSubModals.RemoveTicket
      : ReservationSubModals.SelectTicket
  );

  const loading = useSelector(selectApiState('getFunctionTickets'));
  let {tickets, bookedTickets, credits} = useSelector(
    selectFunctionTicketInfo(functionId)
  );
  tickets = processTickets(tickets, true);
  bookedTickets = processTickets(bookedTickets, false, true);

  const {updatedTickets, memberTicketSelected, totalCost} = defaultSelectTicket(
    (tickets ?? []) as TicketInterface[]
  );

  const [widgetData, setWidgetData] = useState<WidgetDataInterface>({
    credits,
    tickets: updatedTickets,
    bookedTickets: bookedTickets ?? [],
    guestCount: 0,
    memberTicketSelected,
    totalCost
  });
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const [guestData, setGuestData] = useState<Array<Guest>>([]);
  const [ticketsToRemove, setTicketsToRemove] = useState<
    BookedTicketInterface[]
  >([]);

  if (visibleModal === ReservationSubModals.None) handleClose();

  const handleSubmit = (guests?: Array<Guest>) => {
    let ticketData: Array<PostDataInterface> = [];
    for (let t of widgetData.tickets) {
      if (t.memberTicketSelected || t.guestCount) {
        ticketData.push({
          name: t.name ?? '',
          type: t.guestCount ? 'guest' : t.type ?? '',
          dialInSlot: t.selectedSlot ?? t.dialInSlots?.[0] ?? '',
          numberOfGuest: t.guestCount ?? 0,
          price: t.selectedTicketsCost ?? 0,
          guestDetails: t.guestCount ? guests ?? guestData : []
        });
      }
    }

    (async () => {
      setSubmitting(true);
      return await api(
        'postBookTickets',
        {
          userId: userInfo?.id,
          functionId
        },
        {
          method: 'POST',
          data: {
            tickets: ticketData,
            price: {total: widgetData.totalCost, credits: widgetData.credits}
          }
        }
      );
    })()
      .then(() => {
        setSubmitting(false);
        setVisibleModal(ReservationSubModals.ReserveationConfirmed);
      })
      .catch(e => {
        const err = e.response.data;
        if (err.isNominationFailed) {
          setVisibleModal(ReservationSubModals.AddGuest);
          setGuestData(
            prev => getUpdatedGuestData(prev, err.guestDetails) as Guest[]
          );
        } else {
          toast.error(
            err.message ?? 'Error Booking Tickets, Please Try Again!',
            {
              theme: 'dark'
            }
          );
        }
        setSubmitting(false);
      });
  };

  const handleRemoveTickets = () => {
    return api(
      'postRemoveTickets',
      {
        userId: userInfo?.id,
        functionId
      },
      {
        method: 'PUT',
        data: {tickets: ticketsToRemove.map(t => t.id)}
      }
    );
  };

  useEffect(() => {
    if (!tickets) {
      api(
        'getFunctionTickets',
        {
          userId: userInfo?.id,
          functionId,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        },
        {}
      ).catch(err => {
        if (!(err.errorObj instanceof CanceledError)) handleClose();
      });
    }
  }, [functionId]);

  useLayoutEffect(() => {
    if (tickets) {
      const {updatedTickets, memberTicketSelected, totalCost} =
        defaultSelectTicket((tickets ?? []) as TicketInterface[]);

      setWidgetData(w => ({
        ...w,
        credits,
        tickets: updatedTickets,
        bookedTickets,
        memberTicketSelected,
        totalCost
      }));
    }
  }, [loading]);

  return (
    <div>
      {visibleModal === ReservationSubModals.SelectTicket && (
        <SelectTicketModal
          setVisibleModal={setVisibleModal}
          loading={loading}
          widgetData={widgetData}
          setWidgetData={setWidgetData}
          functionId={functionId}
          handleSubmit={handleSubmit}
          submitting={submitting}
          handleClose={handleClose}
        />
      )}

      {visibleModal === ReservationSubModals.RemoveTicket && (
        <RemoveTicketModal
          setVisibleModal={setVisibleModal}
          loading={loading}
          widgetData={widgetData}
          setWidgetData={setWidgetData}
          handleClose={handleClose}
          setTicketsToRemove={setTicketsToRemove}
        />
      )}

      {visibleModal === ReservationSubModals.AddGuest && (
        <AddGuestsModal
          setVisibleModal={setVisibleModal}
          guestData={guestData}
          setGuestData={setGuestData}
          numberOfGuests={widgetData.guestCount}
          totalCost={widgetData.totalCost}
          handleSubmit={handleSubmit}
          submitting={submitting}
          handleClose={handleClose}
        />
      )}

      {visibleModal === ReservationSubModals.ConfirmTickets && (
        <TicketConfirmationModal
          setVisibleModal={setVisibleModal}
          widgetData={widgetData}
          handleSubmit={handleSubmit}
          submitting={submitting}
          handleClose={handleClose}
        />
      )}

      {visibleModal === ReservationSubModals.ConfirmRemoveTicket && (
        <RemoveTicketConfirmationModal
          setVisibleModal={setVisibleModal}
          handleClose={handleClose}
          ticketsToRemove={ticketsToRemove}
          handleRemove={handleRemoveTickets}
        />
      )}

      {visibleModal === ReservationSubModals.ReserveationConfirmed && (
        <ReservationConfirmedModal
          setVisibleModal={setVisibleModal}
          functionId={functionId}
          handleClose={handleClose}
        />
      )}

      {visibleModal === ReservationSubModals.RemoveConfirmed && (
        <CancellationConfirmedModal
          setVisibleModal={setVisibleModal}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
