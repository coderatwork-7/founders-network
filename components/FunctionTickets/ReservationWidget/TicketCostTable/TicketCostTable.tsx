import React from 'react';
import classes from './TicketCostTable.module.scss';
import clsx from 'clsx';
import {WidgetDataInterface} from '../reservationWidget';

interface TicketCostTableProps {
  detailedMode: boolean;
  widgetData: WidgetDataInterface;
}

export const TicketCostTable: React.FC<TicketCostTableProps> = ({
  detailedMode,
  widgetData
}) => {
  const formatNumber = (num: number | undefined) => {
    if (typeof num === 'number') {
      return num.toLocaleString();
    } else {
      return '';
    }
  };

  return (
    <div
      className={clsx([
        classes.ticketCost,
        detailedMode && classes.detailedMode
      ])}
    >
      {detailedMode ? (
        <>
          {widgetData.tickets.map(ticket => (
            <>
              {(!!ticket.guestCount || ticket.memberTicketSelected) && (
                <div key={ticket.id} className={classes.costItem}>
                  <div className={classes.itemName}>
                    {`${formatNumber(ticket.guestCount ?? 1)} ${
                      ticket.name
                    } - ${ticket.type}`}
                  </div>
                  <div className={classes.itemPrice}>
                    ${formatNumber(ticket.selectedTicketsCost)}
                  </div>
                </div>
              )}
            </>
          ))}
        </>
      ) : (
        <div className={classes.costItem}>
          <div className={classes.itemName}>Tickets</div>
          <div className={classes.itemPrice}>
            ${formatNumber(widgetData.totalCost)}
          </div>
        </div>
      )}
      <div className={classes.costItem}>
        <div className={classes.itemName}>Credits</div>
        <div className={classes.itemPrice}>
          ${formatNumber(widgetData.credits)}
        </div>
      </div>
      <div className={classes.costItem}>
        <div className={classes.itemName}>Total</div>
        <div className={classes.itemPrice}>
          $
          {formatNumber(Math.max(widgetData.totalCost - widgetData.credits, 0))}
        </div>
      </div>
    </div>
  );
};
