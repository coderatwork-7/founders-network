import {
  ReservationModalTypes,
  ReservationWidget
} from '@/components/FunctionTickets/ReservationWidget/reservationWidget';
import {FunctionButtons} from '@/ds/FunctionCard/components/functionButtons';
import useDeclineTickets from '@/hooks/useDeclineTicket';
import {useState} from 'react';

export const FunctionTicketsButton: React.FC<{
  functionId: string;
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
  parentClass?: string;
  btnClass?: string;
  onFeedsPage?: boolean;
}> = ({
  functionId,
  addTicketsBtn,
  removeTicketBtn,
  isDeclined,
  parentClass,
  onFeedsPage,
  btnClass
}) => {
  const declineTicket = useDeclineTickets();

  const handleGetTicket = () => {
    if (removeTicketBtn) setOpenModal(ReservationModalTypes.AddTickets);
    setOpenModal(ReservationModalTypes.BookTickets);
  };

  const handleRemoveTicket = () => {
    setOpenModal(ReservationModalTypes.RemoveTickets);
  };

  const handleClose = () => {
    setOpenModal(ReservationModalTypes.None);
  };

  const handleDeclineClick = () => declineTicket(functionId);

  const [openModal, setOpenModal] = useState<ReservationModalTypes>(
    ReservationModalTypes.None
  );

  return (
    <>
      <FunctionButtons
        addTicketsBtn={addTicketsBtn}
        removeTicketBtn={removeTicketBtn}
        isDeclined={isDeclined}
        handleDecline={handleDeclineClick}
        handleGetTicket={handleGetTicket}
        handleRemoveTicket={handleRemoveTicket}
        parentClass={parentClass}
        onFeedsPage={onFeedsPage}
        btnClass={btnClass}
      />
      {openModal !== ReservationModalTypes.None && (
        <ReservationWidget
          handleClose={handleClose}
          functionId={functionId}
          modalType={openModal}
        />
      )}
    </>
  );
};
