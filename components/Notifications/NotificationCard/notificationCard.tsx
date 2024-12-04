import clsx from 'clsx';
import classes from './notificationCard.module.scss';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {NotificationType} from '../notifications';
import {Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import {
  IconDefinition,
  faCalendar,
  faHandshake,
  faMessage,
  faBell
} from '@fortawesome/free-regular-svg-icons';
import {faTag} from '@fortawesome/free-solid-svg-icons';
import Avatar from '@/ds/Avatar/avatar';
import {NOTIFICATION_TYPES} from '@/utils/common/constants';

// TODO: Replace with actual Names.
const ICON_MAP: {[type: string]: IconDefinition} = {
  FnRsvp: faCalendar,
  Deal: faTag,
  Message: faMessage,
  ForumPost: faMessage,
  Partner: faHandshake,
  Investor: faHandshake
};
interface CardPropTypes {
  notification: NotificationType;
  socketMessage: any;
}

function getText(html: string) {
  return html
    .replace(/<(?!\/?a\b)[^>]+>/gi, ' ')
    .replace(/<a\b[^>]*>((.|[\n\r])+?)<\/a>/gi, '<b>$1</b>');
}

export function NotificationCard({notification}: CardPropTypes) {
  const router = useRouter();
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const [loading, setLoading] = useState(false);

  console.log('new notification card', notification);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    (async () => {
      await api('postRemoveNotification', {
        userId: userInfo?.id ?? '',
        notificationId: notification?.id,
        type: NOTIFICATION_TYPES[notification.type]
      })
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    })();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(notification.url);
    if (!notification.is_read) {
      api(
        'postMarkNotificationRead',
        {
          userId: userInfo?.id ?? '',
          notificationId: notification?.id,
          type: NOTIFICATION_TYPES[notification.type]
        },
        {
          method: 'POST',
          data: {id: notification?.id}
        }
      );
    }
  };

  return (
    <div
      className={clsx([
        classes.card,
        notification.is_read && classes.read,
        'my-0'
      ])}
      onClick={handleClick}
    >
      {loading && (
        <div className={classes.spinnerOverlay}>
          <Spinner size="sm" className="fs-6" />
        </div>
      )}
      <div className={classes.iconContainer}>
        {notification.type in ICON_MAP ? (
          <FontAwesomeIcon
            icon={ICON_MAP[notification.type]}
            className="fs-3"
          />
        ) : (
          <>
            {notification?.imageUrl && (
              <img
                src={notification?.imageUrl}
                alt="img"
                height={30}
                width={30}
                style={{borderRadius: '50px'}}
              />
            )}
            {!notification?.imageUrl && (
              <img
                src={notification?.imageUrl}
                alt="img"
                height={30}
                width={30}
                style={{borderRadius: '50px'}}
              />
            )}
          </>
        )}
      </div>
      <div className={classes.notifText}>
        {parse(getText(notification.messageSample))}
        <div className={classes.notifTime}> {notification.sendDateTimeAgo}</div>
      </div>
      <button
        type="button"
        className={clsx(['btn-close', classes.closeBtn])}
        onClick={handleClose}
      ></button>
    </div>
  );
}
