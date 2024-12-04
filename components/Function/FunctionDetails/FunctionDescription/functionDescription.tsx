import Card from '@/ds/Card/card';
import styles from './funcitonDescription.module.scss';
import Parse from 'html-react-parser';
import {CollapsibleContent} from '@/ds/CollapsibleContent';
import {AddToCalendar} from '@/components/AddToCalendar';
import DOMPurify from 'isomorphic-dompurify';
import {useState} from 'react';
import {GoogleMapModal} from '@/components/GoogleMapModal';
import {processAnchorTagAndEmoji} from '@/utils/common/help';

interface DateTimeType {
  startDate: string;
  startTimePT: string;
  endTimePT: string;
  localTime: string;
}

interface LocationType {
  name: string;
  address: string;
  showMapURl: string;
}

interface DetailsType {
  dateTime: DateTimeType;
  location: LocationType;
  descritption: string;
  zoomLink: string;
}

interface FunctionDescriptionPropsType {
  details: DetailsType;
  functionId: string;
}

export const FunctionDescription = ({
  details,
  functionId
}: FunctionDescriptionPropsType) => {
  const [showMap, setShowMap] = useState<boolean>(false);
  return (
    <>
      {showMap && (
        <GoogleMapModal
          setShowModal={setShowMap}
          address={details?.location?.address}
        />
      )}
      <Card className={styles.cardContainer}>
        <div className={styles.dateTimeContainer}>
          <h6 className="fw-bold">Date & Time</h6>
          <div>
            <div>{new Date(details?.dateTime?.startDate).toDateString()}</div>
            <div className="mt-2">
              {details?.dateTime?.startTimePT} - {details?.dateTime?.endTimePT}
              <div>(GMT-0700) Pacific Time</div>
            </div>
            <div className="mt-3 mb-2">{details?.dateTime?.localTime}</div>
            <AddToCalendar
              functionId={functionId}
              showPopover
              popoverPlacement="bottom"
            />
            <div className="mt-5">
              <h6 className="fw-bold">Location</h6>
              {details?.zoomLink?.startsWith('https') && (
                <>
                  <div>{details?.zoomLink}</div>
                </>
              )}
              {!details?.location?.name?.startsWith('https') && (
                <>
                  <div>{details?.location?.name}</div>
                  <div
                    onClick={() => setShowMap(true)}
                    className={styles.mapLink}
                  >
                    <div>{details?.location?.address}</div>
                    <div>{details?.location?.showMapURl}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.descriptionContainer}>
          <h6 className="fw-bold">Description</h6>

          <CollapsibleContent
            mainContent={
              <div className={styles.descriptionHTML}>
                {Parse(
                  DOMPurify.sanitize(details?.descritption, {
                    ADD_TAGS: ['iframe'],
                    ADD_ATTR: [
                      'allow',
                      'allowfullscreen',
                      'frameborder',
                      'scrolling'
                    ]
                  }),
                  {replace: processAnchorTagAndEmoji}
                )}
              </div>
            }
            maxHeight={320}
          />
        </div>
      </Card>
    </>
  );
};
