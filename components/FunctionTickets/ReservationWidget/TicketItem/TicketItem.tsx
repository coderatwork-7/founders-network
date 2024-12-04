import React from 'react';
import classes from './TicketItem.module.scss';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {Select} from '@/ds/Select';
import {Button, ButtonVariants} from '@/ds/Button';
import {TicketInterface} from '../reservationWidget';

interface TicketItemProps {
  ticket: TicketInterface;
  updateTicket?: (ticket: TicketInterface) => void;
  className?: string;
  style?: any;
  selectable?: boolean;
  removable?: boolean;
  onSelectChange?: (id: number, checked: boolean) => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticket,
  updateTicket,
  className,
  style,
  selectable = true,
  removable = false,
  onSelectChange
}) => {
  if (!selectable) {
    return (
      <div className={className} style={style}>
        <div className={clsx(classes.ticket, removable && 'py-3')}>
          <div
            className={clsx(
              classes.info,
              !removable && ticket?.checked && 'flex-grow-1',
              'd-flex flex-column'
            )}
          >
            <div>{ticket?.name ?? ''}</div>
            <div>{ticket.guestName || 'You'}</div>
          </div>
          <div
            className={clsx([
              classes.type,
              classes.nonSelectable,
              !removable && ticket?.checked && 'flex-grow-1'
            ])}
          >
            {ticket.type}
          </div>
          {removable && (
            <div className={classes.removeCheck}>
              <input
                type="checkbox"
                onChange={e =>
                  onSelectChange?.(ticket?.id ?? 0, e.target.checked)
                }
                checked={ticket?.checked}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={className} style={style}>
      <div className={classes.ticket}>
        <div className={classes.info}>
          <div className={classes.ticketName}>{ticket.name}</div>
          <div>${ticket.price}</div>
        </div>
        <div className={classes.type}>
          <div>{ticket.type}</div>
          {!!ticket.dialInSlots?.length && (
            <Select
              items={ticket.dialInSlots}
              onChange={(val: string) => {
                updateTicket?.({
                  id: ticket.id,
                  selectedSlot: val
                });
              }}
              className="py-0 gap-1 text-uppercase"
              defaultVal={ticket.selectedSlot ?? undefined}
            />
          )}
        </div>
        <div className={classes.selection}>
          {ticket.numberOfGuest === 0 && (
            <Button
              variant={ButtonVariants.BluePrimary}
              className={clsx([
                classes.btn,
                ticket.memberTicketSelected && classes.selected
              ])}
              onClick={() => {
                updateTicket?.({
                  id: ticket.id,
                  memberTicketSelected: !ticket.memberTicketSelected,
                  selectedTicketsCost: ticket.memberTicketSelected
                    ? 0
                    : ticket.price ?? 0
                });
              }}
              textUppercase
            >
              {ticket.memberTicketSelected ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                  <div>Selected</div>
                </>
              ) : (
                'Select'
              )}
            </Button>
          )}
          {ticket.numberOfGuest !== 0 && (
            <Select
              items={Array.from(
                {length: (ticket.numberOfGuest ?? 1) + 1},
                (_, index) => index
              )}
              onChange={(val: number) => {
                updateTicket?.({
                  id: ticket.id,
                  guestCount: val,
                  selectedTicketsCost: (ticket.price ?? 0) * val
                });
              }}
              className={clsx([classes.guestCount, 'py-0'])}
              defaultVal={ticket.guestCount ?? 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};
