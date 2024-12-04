import {selectFunctionCard, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Spinner} from '@/ds/Spinner';
import {FunctionSummary} from './FunctionSummary/functionSummary';
import {FunctionReviews} from './FunctionReviews/functionsReviews';
import {FunctionAttendees} from './FunctionAttendees/functionAttendees';
import {FunctionGuest} from './FunctionGuests/functionGuests';
import {FunctionTicket} from './FunctionTicket/functionTicket';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {FunctionDescription} from './FunctionDescription/functionDescription';
import {FunctionSponsor} from './FunctionSponsor/functionSponsor';
import {FunctionSidebar} from './FuntionSidebar/functionSidebar';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {
  convertObjectUsingReverseMapping,
  isObjectEmpty
} from '@/utils/common/helper';
import {FUNCTION_DETAILS_MAP} from '@/utils/common/apiToStoreMaps';
import {isPast} from 'date-fns';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
import {ROLES} from '@/utils/common/constants';
import {FunctionRSVP} from './FunctionAdmin/FunctionRSVP/functionRSVP';

export const FunctionDetails = ({functionStaticInfo}: any) => {
  const router = useRouter();
  const {functionId} = useRouter().query;
  const userInfo = useSelector(selectUserInfo());
  const functionInfo = convertObjectUsingReverseMapping(
    useSelector(selectFunctionCard(functionId as string)) ?? {},
    FUNCTION_DETAILS_MAP,
    ['bookedTickets']
  );
  const IsEventPassed = isPast(
    new Date(functionStaticInfo?.details?.dateTime?.endDate)
  );
  const makeApiCall = useAPI();
  const isMobile = Breakpoint.mobile === useBreakpoint();

  const fetchFunctionDetails = async () => {
    if (functionId)
      await makeApiCall('getFunctionDetails', {
        userId: userInfo?.id,
        functionId,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      }).catch(err => {
        if (!(err.errorObj instanceof ConcurrentApiNotAllowed))
          router.replace('/404');
      });
  };
  useEffect(() => {
    if (userInfo?.id && functionId && !functionInfo?.attendees)
      fetchFunctionDetails();
  }, [userInfo?.id, functionId, functionInfo]);

  if (isObjectEmpty(functionStaticInfo)) {
    return <Spinner className="mt-5" />;
  }
  return (
    <div>
      {!isMobile && <FunctionSidebar />}

      <div className={isMobile ? 'mb-3' : 'mb-4'} id="summary">
        <FunctionSummary
          summary={functionStaticInfo?.summary}
          functionId={functionId as string}
          isEventPassed={IsEventPassed}
          addTicketsBtn={functionInfo?.addTicketsBtn}
          isDeclined={functionInfo?.isDeclined}
          removeTicketBtn={functionInfo?.removeTicketBtn}
          bookedTickets={functionInfo?.bookedTickets}
          numberOfAttendees={
            functionInfo?.attendees?.count?.inPerson +
            functionInfo?.attendees?.count?.dialIn
          }
        />
      </div>
      {functionStaticInfo?.reviews?.tweets.length !== 0 && (
        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <FunctionReviews
            reviewsTweets={functionStaticInfo?.reviews?.tweets}
          />
        </div>
      )}
      <div className={isMobile ? 'mb-3' : 'mb-4'} id="details">
        <FunctionDescription
          details={functionStaticInfo?.details}
          functionId={functionId as string}
        />
      </div>
      {functionStaticInfo?.featured?.guestDetails?.length !== 0 && (
        <div className={isMobile ? 'mb-3' : 'mb-4'} id="featured">
          <FunctionGuest
            guestDetails={functionStaticInfo?.featured?.guestDetails}
          />
        </div>
      )}
      {!isObjectEmpty(functionInfo?.attendees) &&
        functionInfo?.attendees?.list?.length !== 0 && (
          <div className={isMobile ? 'mb-3' : 'mb-4'} id="attendees">
            <FunctionAttendees attendees={functionInfo?.attendees} />
          </div>
        )}
      <div className={isMobile ? 'mb-3' : 'mb-4'} id="tickets">
        <FunctionTicket
          addTicketsBtn={functionInfo?.addTicketsBtn}
          isDeclined={functionInfo?.isDeclined}
          removeTicketBtn={functionInfo?.removeTicketBtn}
          include={functionInfo?.tickets.include}
          isEventPassed={IsEventPassed}
        />
      </div>
      {userInfo?.role === ROLES.ADMIN && (
        <div className={isMobile ? 'mb-3' : 'mb-4'} id="rsvps">
          <FunctionRSVP functionName={functionStaticInfo?.summary?.title} />
        </div>
      )}
      {functionStaticInfo?.sponsors?.length !== 0 && (
        <div className={isMobile ? 'mb-3' : 'mb-5'}>
          <FunctionSponsor details={functionStaticInfo.sponsors} />
        </div>
      )}
    </div>
  );
};
