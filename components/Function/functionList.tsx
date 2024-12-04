import React, {MouseEvent, useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import {FunctionCard} from '@/ds/FunctionCard';
import useIsMobile from '@/utils/common/useIsMobile';
import CalendarIcon from '@/public/svgIcons/calendar_ico.svg';

import classes from './functionList.module.scss';
import {VideoModal} from '@/ds/VideoModal';
import {selectFunctionCard} from '@/store/selectors';
import SelectorWrapper from '../Common/selectorWrapper';
import {
  facetStateFromUrl,
  pascalCase,
  retrieveSingleFacetStateKey
} from '@/utils/common/helper';
import {useSearchParams} from 'next/navigation';
import {ReservationWidget} from '../FunctionTickets/ReservationWidget';
import useDeclineTickets from '../../hooks/useDeclineTicket';
import {OnboardingTooltip} from '../Onboarding/OnboardingTooltip';
import {ReservationModalTypes} from '../FunctionTickets/ReservationWidget/reservationWidget';

enum FunctionWidgets {
  None,
  ReservationBook,
  ReservationRemove,
  Video
}

export const FunctionList: React.FC<{
  ids: string[];
  onSearchPage?: boolean;
}> = ({ids, onSearchPage}) => {
  const query = useSearchParams();
  const facetState = useMemo(() => facetStateFromUrl(query), [query]);

  const [activeWidget, setActiveWidget] = useState<FunctionWidgets>(
    FunctionWidgets.None
  );
  const [videoLink, setVideoLink] = useState<string | undefined>();
  const [functionId, setFunctionId] = useState<string>('');
  const isMobile = useIsMobile();
  const declineTicket = useDeclineTickets();

  const handleVideoModal = useCallback(
    (event: MouseEvent<HTMLDivElement>, videoLink: string) => {
      setActiveWidget(FunctionWidgets.Video);
      setVideoLink(videoLink);
    },
    [videoLink]
  );

  const handleGetTicket = useCallback((id: string) => {
    setFunctionId(id);
    setActiveWidget(FunctionWidgets.ReservationBook);
  }, []);

  const handleRemoveTicket = useCallback((id: string) => {
    setFunctionId(id);
    setActiveWidget(FunctionWidgets.ReservationRemove);
  }, []);

  const handleDeclineTicket = (id: string) => {
    return declineTicket(id);
  };

  const handleCloseWidget = useCallback(() => {
    setActiveWidget(FunctionWidgets.None);
    setVideoLink(undefined);
  }, []);

  let message = 'All Functions For You';
  const retrieve = retrieveSingleFacetStateKey.bind({}, facetState);
  const startDate = retrieve('start_date');
  const sorting = retrieve('sort');

  if (startDate) {
    message = `Functions for ${startDate.facetValueKey}`;
  } else if (sorting) {
    message = `${pascalCase(sorting.facetValueKey)} Functions`;
  }

  const functionCards = (
    <>
      {ids.map((id: any) => {
        return (
          <SelectorWrapper
            key={id}
            id={id}
            selector={selectFunctionCard}
            Component={FunctionCard}
            props={{
              handleVideoModal,
              handleGetTicket,
              handleDeclineTicket,
              handleRemoveTicket,
              searchPageCard: !!onSearchPage
            }}
          />
        );
      })}
    </>
  );

  const modals = (
    <>
      {activeWidget === FunctionWidgets.Video && (
        <VideoModal
          videoLink={videoLink}
          showModal={true}
          handleCloseModal={handleCloseWidget}
        />
      )}

      {activeWidget === FunctionWidgets.ReservationBook && (
        <ReservationWidget
          handleClose={handleCloseWidget}
          functionId={functionId}
          modalType={ReservationModalTypes.BookTickets}
        />
      )}

      {activeWidget === FunctionWidgets.ReservationRemove && (
        <ReservationWidget
          handleClose={handleCloseWidget}
          functionId={functionId}
          modalType={ReservationModalTypes.RemoveTickets}
        />
      )}
    </>
  );

  if (onSearchPage)
    return (
      <>
        {functionCards}
        {modals}
      </>
    );

  return (
    <>
      <div
        className={clsx(
          'd-flex w-100 justify-content-center align-items-center gap-3'
        )}
      >
        <Image
          src={CalendarIcon}
          alt="Calendar Icon"
          width={70}
          height={70}
        ></Image>
        <div className={clsx(classes.heading, isMobile && classes.mobile)}>
          {message}
        </div>
      </div>
      <div className={classes.onboarding}>
        <OnboardingTooltip type="functions" position="top" />
      </div>
      <div className="row row-cols-2 w-100 gy-3 gx-2 m-auto">
        {functionCards}
      </div>
      {modals}
    </>
  );
};
