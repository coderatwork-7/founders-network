import Card from '@/ds/Card/card';
import styles from './functionTicket.module.scss';
import React from 'react';
import Parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import {useRouter} from 'next/router';
import {FunctionTicketsButton} from '../FunctionTicketsButtons/functionTicketsButton';
import {processAnchorTagAndEmoji} from '@/utils/common/help';

interface FunctionticketPropsType {
  addTicketsBtn: boolean;
  isDeclined: boolean;
  removeTicketBtn: boolean;
  include: string;
  isEventPassed: boolean;
}

export const FunctionTicket: React.FC<FunctionticketPropsType> = ({
  addTicketsBtn,
  isDeclined,
  removeTicketBtn,
  include,
  isEventPassed
}) => {
  const {functionId} = useRouter().query;

  return (
    <Card className={styles.ticketContainer}>
      {!isEventPassed && (
        <div>
          <h5 className="fw-bold text-start mb-4 text-uppercase">Tickets</h5>
          <FunctionTicketsButton
            functionId={functionId as string}
            parentClass={styles.ticketButton}
            addTicketsBtn={addTicketsBtn}
            removeTicketBtn={removeTicketBtn}
            isDeclined={isDeclined}
          />
        </div>
      )}
      <div>
        <h5 className="fw-bold text-start mb-4 text-uppercase">
          Tickets Include :
        </h5>
        <div className={styles.ticketInclude}>
          {Parse(DOMPurify.sanitize(include), {
            replace: processAnchorTagAndEmoji
          })}
        </div>
      </div>
    </Card>
  );
};
