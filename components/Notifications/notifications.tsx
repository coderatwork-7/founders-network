import React, {useContext, useEffect, useRef, useState} from 'react';
import classes from './notifications.module.scss';
import {Badge} from '@/ds/Badge';
import useAPI from '@/utils/common/useAPI';
import {
  selectApiState,
  selectNotifications,
  selectUserInfo
} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {NotificationCard} from './NotificationCard';
import clsx from 'clsx';
import {Popover} from '@/ds/Popover';
import {Spinner} from '@/ds/Spinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {faPenToSquare, faBell} from '@fortawesome/free-regular-svg-icons';
import {NotificationIcon} from '@/ds/Icons';
import {useSession} from 'next-auth/react';
import {WebSocketContext} from '@/context/websocketProvider';
import axios from 'axios';

export type NotificationType = {
  id: number;
  type: string;
  messageSample: string;
  url: string;
  is_read: boolean;
  sendDateTime: string;
  sendDateTimeAgo: string;
  imageUrl: any;
};

interface NotificationState {
  info?: {
    count: number;
  };
  [id: number]: NotificationType;
}

export const Notifications = () => {
  const api = useAPI();

  const userInfo = useSelector(selectUserInfo());
  const loading = useSelector(selectApiState('getNotifications'));
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isShaking, setIsShaking] = useState(false);
  const notificationData: NotificationState = useSelector(
    selectNotifications()
  );
  const message = useContext(WebSocketContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const [webSocketMessage, setWebSocketMessage] = useState<any[]>([]); // Initialize as an array

  const messageObject =
    typeof message === 'string' ? JSON.parse(message) : message;
  const displayMessage = messageObject?.message;

  useEffect(() => {
    if (messageObject?.count !== undefined) {
      const currentCount = messageObject.count;
      const prevCount = prevMessageCountRef.current;

      if (currentCount > prevCount) {
        setMessageCount(currentCount);
        setIsShaking(true);

        // Play audio if available
        if (audioRef.current) {
          audioRef.current.play();
        }

        // Check if displayMessage is valid before updating state
        if (displayMessage) {
          setWebSocketMessage(prevMessages => [
            ...prevMessages,
            displayMessage
          ]);
        }

        setTimeout(() => setIsShaking(false), 500);
      }

      prevMessageCountRef.current = currentCount;
    }
  }, [messageObject, displayMessage]);

  console.log('websocket meaages', webSocketMessage);

  const {update, data: session} = useSession();
  let {info: {count = undefined} = {}, ...notificationsObj} =
    notificationData || {};
  count = count ?? userInfo?.notificationCount;
  let notifications = Object.values(notificationsObj);

  const handleReadNotification = async () => {
    setMessageCount(0);
    const token = session?.user?.tokens?.access;
    try {
      const response = await axios.get(
        `https://staging.foundersnetwork.com/v1/api/users/${userInfo?.id}/notifications/read`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('respose data ', response);
    } catch (error) {
      console.log('api error', error);
    }
  };

  const handleClick = () => {
    console.log('api call');
    setMessageCount(0);
    if (count) {
      update({notificationCount: 0});
      api(
        'getMarkNotificationsChecked',
        {
          userId: userInfo?.id
        },
        {
          method: 'GET'
        }
      );
    }
  };

  const popover = (
    <div className={classes.container}>
      <div className="ms-3 p-2 fs-6 text-dark">Notifications</div>
      <div className={classes.list}>
        {loading ? (
          <div className="text-center m-5 ">
            <Spinner />
          </div>
        ) : (
          <div className={classes.messageListContainer}>
            {webSocketMessage.length > 0 &&
              webSocketMessage.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: '#f0fff6',
                    padding: '5px',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{display: 'flex', flexDirection: 'row', gap: '10px'}}
                  >
                    <div className={classes.iconContainer}>
                      {/* <FontAwesomeIcon icon={faBell} className="fs-3" /> */}
                      <img
                        src={message?.imageUrl}
                        alt="img"
                        height={30}
                        width={30}
                        style={{borderRadius: '50px'}}
                      />
                    </div>
                    <div className={classes.notifText}>
                      {message?.messageSample}
                      <div className={classes.notifTime}>
                        {message?.sendDateTimeAgo}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={clsx(['btn-close', classes.closeBtn])}
                    onClick={() =>
                      setWebSocketMessage(prev =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  ></button>
                </div>
              ))}

            {webSocketMessage.length === 0 && notifications.length === 0 && (
              <NoNotifications />
            )}
            {notifications.map(notif => (
              <div key={notif.id}>
                <NotificationCard
                  notification={notif}
                  socketMessage={webSocketMessage}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Popover
        popover={popover}
        hideArrow={false}
        hideOnBlur={true}
        popoverClass={clsx([
          classes.popover,
          'container-border container-box-shadow'
        ])}
        mode="click"
        placement="bottom-end"
        fixedPosition
        offset={[0, 12]}
      >
        <div>
          <Badge
            icon={
              <NotificationIcon
                className={clsx(classes.icon, {[classes.shake]: isShaking})}
              />
            } // Apply shake class if shaking
            count={messageCount}
            onClick={handleReadNotification}
          />
        </div>
      </Popover>

      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
    </>
  );
};

const NoNotifications = () => {
  return (
    <div className="text-center d-flex flex-column">
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="fa-3x text-secondary m-4"
      />
      <span className="fs-5">Nothing here...</span>
      <span className="fs-6 mb-3">
        Visit <Link href="/forum/">Forum</Link>
      </span>
    </div>
  );
};
