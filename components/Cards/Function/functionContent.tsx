import classes from './functionContent.module.scss';
import Link from 'next/link';
import {
  CONST_QUESTION,
  FUNCTION_CONTENT_TITLE_LIMIT
} from '@/utils/common/constants';
import {TYPE_RSVP, TYPE_POST, TYPE_QUESTION} from '@/utils/common/commonTypes';
import {FunctionTicketsButton} from '@/components/Function/FunctionDetails/FunctionTicketsButtons/functionTicketsButton';

interface FunctionContentProps {
  functionId: string;
  image: string;
  title?: string;
  subtype: TYPE_RSVP | TYPE_POST | TYPE_QUESTION;
  imageAltText: string;
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
  isPastEvent: boolean;
}

export default function FunctionContent({
  functionId,
  image,
  title,
  subtype,
  imageAltText,
  addTicketsBtn,
  removeTicketBtn,
  isDeclined,
  isPastEvent
}: FunctionContentProps): JSX.Element {
  return (
    <div>
      {title && (
        <Link href={`/function/${functionId}`} className={classes.title}>
          {title.slice(0, FUNCTION_CONTENT_TITLE_LIMIT)}
          {title.length > FUNCTION_CONTENT_TITLE_LIMIT && <span>...</span>}
        </Link>
      )}
      {/*TODO:maybe replace with next Image*/}
      {image && (
        <Link href={`/function/${functionId}`}>
          <img
            alt={imageAltText}
            className="w-100 rounded-3"
            src={image}
            placeholder="blur"
          ></img>
        </Link>
      )}
      {!isPastEvent && subtype !== CONST_QUESTION && (
        <FunctionTicketsButton
          functionId={functionId}
          addTicketsBtn={addTicketsBtn}
          removeTicketBtn={removeTicketBtn}
          isDeclined={isDeclined}
          parentClass={classes.buttonContainer}
          onFeedsPage
          btnClass={classes.btn}
        />
      )}
    </div>
  );
}
