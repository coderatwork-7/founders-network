import clsx from 'clsx';
import classes from '../functionCard.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import {MouseEventHandler, useState} from 'react';

export const FunctionButtons: React.FC<{
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
  handleGetTicket?: MouseEventHandler<HTMLButtonElement>;
  handleRemoveTicket?: MouseEventHandler<HTMLButtonElement>;
  handleDecline?: () => Promise<any>;
  parentClass?: string;
  btnClass?: string;
  onFeedsPage?: boolean;
}> = ({
  addTicketsBtn,
  handleGetTicket,
  removeTicketBtn,
  handleRemoveTicket,
  isDeclined,
  handleDecline,
  parentClass,
  btnClass,
  onFeedsPage
}) => {
  const [declining, setDeclining] = useState(false);

  const handleDeclineClick = () => {
    setDeclining(true);
    handleDecline?.()
      .then(() => setDeclining(false))
      .catch(() => setDeclining(false));
  };

  return (
    <div
      className={clsx(
        parentClass ?? classes['rows'],
        removeTicketBtn && !addTicketsBtn && 'justify-content-end'
      )}
    >
      {removeTicketBtn && (
        <Button
          onClick={handleRemoveTicket}
          variant={ButtonVariants.OutlineSecondary}
          size={onFeedsPage ? 'lg' : undefined}
          subVariant={onFeedsPage ? 'occupyHalfWidth' : undefined}
          className={btnClass}
        >
          REMOVE TICKET
        </Button>
      )}

      {!removeTicketBtn && (
        <Button
          onClick={handleDeclineClick}
          variant={
            isDeclined
              ? ButtonVariants.Secondary
              : ButtonVariants.OutlineSecondary
          }
          loading={declining}
          disabled={declining}
          loadingChildren={'DECLINING'}
          size={onFeedsPage ? 'lg' : undefined}
          subVariant={onFeedsPage ? 'occupyHalfWidth' : undefined}
          className={btnClass}
        >
          {isDeclined ? 'DECLINED' : 'DECLINE'}
        </Button>
      )}

      {addTicketsBtn && (
        <Button
          onClick={handleGetTicket}
          variant={ButtonVariants.Primary}
          size={onFeedsPage ? 'lg' : undefined}
          subVariant={onFeedsPage ? 'occupyHalfWidth' : undefined}
          className={btnClass}
        >
          ADD TICKETS
        </Button>
      )}

      {!addTicketsBtn && !removeTicketBtn && (
        <Button
          onClick={handleGetTicket}
          variant={ButtonVariants.Primary}
          size={onFeedsPage ? 'lg' : undefined}
          subVariant={onFeedsPage ? 'occupyHalfWidth' : undefined}
          className={btnClass}
        >
          TICKETS
        </Button>
      )}
    </div>
  );
};
