import Card from '@/ds/Card/card';
import styles from './functionSummary.module.scss';
import {Rating, RatingTextPos} from '@/ds/Rating';
import Link from 'next/link';
import {AddToCalendar} from '@/components/AddToCalendar';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {handleSpecificScroll} from '@/utils/common/helper';
import clsx from 'clsx';
import {FunctionTicketsButton} from '../FunctionTicketsButtons/functionTicketsButton';

interface SummaryType {
  coverImageUrl: string;
  date: string;
  numberOfAttendees: number;
  price: string;
  rating: number;
  title: string;
}

interface FunctionHeaderPropType {
  summary: SummaryType;
  functionId: string;
  isEventPassed: boolean;
  addTicketsBtn: boolean;
  isDeclined: boolean;
  removeTicketBtn: boolean;
  bookedTickets: any;
  numberOfAttendees: number;
}

export const FunctionSummary = ({
  summary,
  functionId,
  isEventPassed,
  addTicketsBtn,
  isDeclined,
  removeTicketBtn,
  bookedTickets,
  numberOfAttendees
}: FunctionHeaderPropType) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <div>
      <img
        className={styles.functionBanner}
        src={summary?.coverImageUrl}
        alt="Function Detail Banner"
      />
      <Card className={clsx('px-4 py-4', styles.cardContainer)}>
        <div className="d-flex justify-content-between">
          <div className={styles.dateAndPrice}>
            <span>{summary?.date}</span>
            <span>{summary?.price}</span>
            <AddToCalendar
              functionId={functionId}
              showPopover
              popoverPlacement="bottom"
            />
          </div>
          {numberOfAttendees ? (
            <div className="d-flex gap-4 align-items-center">
              <Link href={'#attendees'}>
                <div className={styles.attendees}>
                  {numberOfAttendees} Attendees
                </div>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="my-3 text-start">
          <div className={styles.summaryHeader}>{summary?.title}</div>
        </div>
        {isEventPassed ? (
          <div className="text-start">
            <Rating
              rating={summary?.rating}
              onClick={() => undefined}
              staticDisplay
              allowFraction
              ratingTextPosition={RatingTextPos.None}
            />
          </div>
        ) : (
          <div>
            <div
              className={clsx(
                isMobile && 'flex-column',
                'd-flex gap-4 align-items-center'
              )}
            >
              <FunctionTicketsButton
                functionId={functionId}
                parentClass={styles.ticketButton}
                addTicketsBtn={addTicketsBtn}
                removeTicketBtn={removeTicketBtn}
                isDeclined={isDeclined}
              />

              <div
                className={styles.whatIncluded}
                onClick={() => handleSpecificScroll({id: 'tickets', isMobile})}
              >
                What's included in the ticket?
              </div>
            </div>
            {bookedTickets && bookedTickets?.length !== 0 && (
              <Card className={styles.bookedTickets}>
                <h5 className="fw-bold my-3">Your Tickets</h5>
                {bookedTickets?.map((ele: any, index: number) => {
                  return (
                    <div key={`${ele.guestName}-${index}`}>
                      {ele.name} : {ele.guestName} - {ele.type}
                    </div>
                  );
                })}
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
