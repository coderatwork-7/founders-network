import Card from '@/ds/Card/card';
import AddMemberIcon from '@/public/icons/add_member_icon.svg';
import Image from 'next/image';
import styles from './functionRSVPCount.module.scss';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import {AddRSVPModal} from '../AddRSVPModal/addRSVPModal';
import {ManageRSVPModal} from '../ManageRSVPModal/manageRSVPModal';

export const MemberListingMapping: Record<string, string> = {
  all: `All RSVP'd`,
  membersAttending: 'Members Attending',
  membersDialingIn: 'Members Dialing In',
  membersAttendWaitList: 'Members Attend Waitlist',
  membersDialInWaitlist: 'Members Dial In Waitlist',
  guestsAttending: 'Guests Attending',
  guestsDialin: 'Guests Dialin',
  maybe: 'Maybe',
  declined: 'Declined',
  invited: 'Invited'
};

interface FunctionRSVPCountTypes {
  rsvps: Record<string, any>;
  setListName: any;
  listName: string;
}

export const FunctionRSVPCount: React.FC<FunctionRSVPCountTypes> = ({
  rsvps,
  setListName,
  listName
}) => {
  const [showAddRSVPModal, setAddRSVPModal] = useState<boolean>(false);
  const [manageModal, setManageModal] = useState<boolean>(false);
  const [currentRSVP, setCurrentRSVP] = useState<Record<string, any>>({});

  const handleManageModal = () => {
    setManageModal(false);
  };

  return (
    <Card className={styles.cardContainer}>
      <div className="d-flex justify-content-between align-items-center">
        <div>RSVP's</div>
        <div>
          <Image
            src={AddMemberIcon}
            width={45}
            height={45}
            alt="Add Member Icon"
            className={styles.addIcon}
            onClick={() => setAddRSVPModal(true)}
          />
          {showAddRSVPModal && (
            <AddRSVPModal
              rsvps={rsvps}
              setCloseModal={setAddRSVPModal}
              setCurrentRSVP={setCurrentRSVP}
              setManageModal={setManageModal}
            />
          )}
          {manageModal && (
            <ManageRSVPModal
              handleCloseModal={handleManageModal}
              currentManageRSVP={currentRSVP}
            />
          )}
        </div>
      </div>

      <div className="mt-2">
        {rsvps &&
          Object.keys(rsvps).map((ele: string) => {
            const name = MemberListingMapping[ele];
            const count = rsvps[ele].count ?? 0;
            if (count == 0) return null;
            return (
              <div key={name} onClick={() => setListName(ele)}>
                <Card
                  className={clsx(
                    styles.listingCard,
                    listName === ele && 'fw-bold',
                    styles[ele]
                  )}
                >
                  <div className={styles.listingName}>{name}</div>
                  <div>
                    {count}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={styles.arrowIcon}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
      </div>
    </Card>
  );
};
