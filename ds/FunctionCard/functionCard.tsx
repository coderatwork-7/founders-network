import React, {MouseEvent, useCallback} from 'react';
import Card from '../Card/card';
import CardContent from '../Card/cardContent';
import clsx from 'clsx';

import classes from './functionCard.module.scss';
import Link from 'next/link';
import {AddToCalendar} from '@/components/AddToCalendar';
import {isPast} from 'date-fns';
import {useRouter} from 'next/navigation';
import useIsMobile from '@/utils/common/useIsMobile';
import {FunctionButtons} from './components/functionButtons';
import {CardThumbnail} from './components/cardThumbnail';
import {displayDateTime} from '@/utils/common/helper';

export interface FunctionCardData {
  id: number;
  type: string;
  subtype: string;
  author?: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  title: string;
  creationTimestamp: string;
  location?: string;
  eventLink?: string;
  media: {
    altText: string;
    imageSrc: string;
    videoLink: string;
  };
  details: {
    startDate: string;
    startTimePT: string;
    startTimeET: string;
    endDate: string;
    endTimePT: string;
    endTimeET: string;
  };
  attendeesCount?: number | string;
  addToCalendar: {
    ical?: string;
    outlook?: string;
    google?: string;
  };
  badge: Array<string>;
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
}

interface FunctionCardProps {
  data: FunctionCardData;
  handleVideoModal?: (
    event: MouseEvent<HTMLDivElement>,
    videoLink: string
  ) => void;
  handleGetTicket?: (id: string) => void;
  handleDeclineTicket: (id: string) => Promise<any>;
  handleRemoveTicket?: (id: string) => void;
  searchPageCard?: boolean;
}

// export const FunctionCard: React.FC = () => <></>;
export const FunctionCard: React.FC<FunctionCardProps> = ({
  data: {
    attendeesCount,
    details: {startDate, endDate},
    media: {altText, imageSrc, videoLink},
    addTicketsBtn,
    removeTicketBtn,
    isDeclined,
    eventLink,
    title,
    addToCalendar,
    badge,
    location,
    id
  },
  handleVideoModal,
  handleGetTicket,
  handleRemoveTicket,
  handleDeclineTicket,
  searchPageCard = false
}) => {
  const pastEvent = isPast(new Date(endDate));
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleThumbnailClick = useCallback(() => {
    router.push(`${id}`);
  }, [id, router]);

  return (
    <div
      className={clsx(
        classes.wrapper,
        isMobile && classes.mobile,
        searchPageCard && classes.searchCard
      )}
    >
      <Card className={classes['card-container']}>
        <CardThumbnail
          bannerLink={`/function/${id}`}
          altText={altText}
          imageSrc={imageSrc}
          videoLink={videoLink}
          eventBadge={badge}
          handleThumbnailClick={handleThumbnailClick}
          handleVideoModal={handleVideoModal}
        />
        <CardContent
          className={clsx(
            'p-3 pt-1 m-0',
            'text-start',
            'd-flex flex-column flex-grow-1'
          )}
        >
          <Link href={`/function/${id}`} className={clsx(classes.title)}>
            {title}
          </Link>
          <div
            className={clsx('d-flex flex-grow-1', 'w-100', classes['content'])}
          >
            <div
              className={clsx(
                'd-flex',
                'flex-column',
                'gap-3',
                'flex-grow-1',
                'mw-100'
              )}
            >
              <div className={clsx(classes.rows, classes.mh)}>
                <div className="w-75">
                  <div className="text-truncate">{eventLink}</div>
                  <div>{location}</div>
                </div>
                {!!attendeesCount && (
                  <div className="ms-auto">{attendeesCount} RSVPs</div>
                )}
              </div>
              <div
                className={clsx(
                  classes.rows,
                  !pastEvent && classes.mh,
                  pastEvent && 'justify-content-end'
                )}
              >
                {!pastEvent && addToCalendar && (
                  <AddToCalendar
                    functionId={id.toString()}
                    showPopover
                    popoverPlacement="bottom-start"
                  />
                )}
                <div className={clsx(classes['datetime'])}>
                  {displayDateTime({startDate, endDate})}
                </div>
              </div>
              {!pastEvent ? (
                <div className="mt-auto">
                  <FunctionButtons
                    addTicketsBtn={addTicketsBtn}
                    removeTicketBtn={removeTicketBtn}
                    isDeclined={isDeclined}
                    handleDecline={() => handleDeclineTicket?.(id.toString())}
                    handleGetTicket={() => handleGetTicket?.(id.toString())}
                    handleRemoveTicket={() =>
                      handleRemoveTicket?.(id.toString())
                    }
                    btnClass={classes.btn}
                  />
                </div>
              ) : (
                <div className="text-center mt-auto">This Event Has Passed</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
