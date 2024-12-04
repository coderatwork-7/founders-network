import React from 'react';
import defaultClasses from './message.module.scss';
import popupClasses from './messagePopup.module.scss';
import {MessageType} from '../chatModal';
import Parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import {IconWrapper} from '@/ds/Icons';
import {faFile} from '@fortawesome/free-regular-svg-icons';
import {Spinner} from '@/ds/Spinner';
import {processAnchorTagAndEmoji} from '@/utils/common/help';
import {formatChatDateTime} from '@/utils/common/helper';

interface MessageProps {
  msg: MessageType;
  isSent?: boolean;
  asPopup?: boolean;
}

export const Message: React.FC<MessageProps> = ({
  msg,
  isSent = false,
  asPopup = false
}) => {
  const classes = asPopup ? popupClasses : defaultClasses;

  return (
    <div className={clsx([classes.message, isSent && classes.sent])}>
      <div className={classes.msgText}>
        <span>
          {Parse(DOMPurify.sanitize(msg.message ?? ''), {
            replace: processAnchorTagAndEmoji
          })}
        </span>
        {(msg.attachments?.length ?? 0) > 0 && (
          <div>
            {msg.attachments?.map(file => (
              <a
                key={file?.url}
                href={file.url}
                target="_blank"
                className={classes.fileButton}
              >
                <IconWrapper icon={faFile} className={classes.fileIcon} />
                <div className="text-truncate">{file.filename}</div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className={classes.time}>
        {!msg?.sending ? (
          formatChatDateTime(msg.timestamp ?? '')
        ) : (
          <>
            Sending <Spinner className={classes.sending} />
          </>
        )}
      </div>
    </div>
  );
};
