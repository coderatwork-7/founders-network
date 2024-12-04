import Card from '@/ds/Card/card';
import DownloadButton from '@/public/icons/download_button.svg';
import Image from 'next/image';
import styles from './functionRSVPList.module.scss';
import clsx from 'clsx';
import React, {useState} from 'react';
import {MemberListingMapping} from '../FunctionRSVPCount/functionRSVPCount';
import {ProfileNameTooltip} from '@/components/ProfileTooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {EmailListModal} from '../EmaiListModal/emailListModal';
import {Spinner} from 'react-bootstrap';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {useRouter} from 'next/router';
import {ManageRSVPModal} from '../ManageRSVPModal/manageRSVPModal';

interface FunctionRSVPListTypes {
  rsvps: Record<string, any>;
  listName: string;
  functionName: string;
}

const convertToCSV = (data: Record<string, any>[]) => {
  const headers = Object.keys(data[0]);
  const csvData = [
    headers,
    ...data.map(row =>
      headers.map(header => {
        if (typeof row[header] == 'string')
          return row[header].replace(/,/g, '');
        return row[header];
      })
    )
  ];
  const csvDownloadData = csvData.map(row => row.join(',')).join('\n');
  return csvDownloadData;
};

const downloadCSV = (csvData: string, fileName: string) => {
  const blob = new Blob([csvData], {type: 'text/csv'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const functionRSVPType = (
  ele: Record<string, any>,
  listName: string,
  rsvps: Record<string, any>
) => {
  if (listName == 'all') {
    const toFind = [
      'membersAttending',
      'membersDialingIn',
      'guestsAttending',
      'guestDialIn'
    ];

    let allPersonType = '';

    toFind.forEach((item: string) => {
      const found = rsvps[item]?.list.find(
        (person: Record<string, any>) => ele.profileId == person.profileId
      );

      if (found) {
        allPersonType = item.includes('Attend') ? 'attending' : 'dialin';
      }
    });
    return {
      type: allPersonType,
      profileDetail: ele
    };
  } else {
    if (listName == 'invited' || listName == 'declined')
      return {
        type: listName,
        profileDetail: ele
      };
    else {
      const isAttending = listName.includes('Attending')
        ? 'attending'
        : 'dialin';
      return {
        type: isAttending,
        profileDetail: ele
      };
    }
  }
};

export const FunctionRSVPList: React.FC<FunctionRSVPListTypes> = ({
  rsvps,
  listName,
  functionName
}) => {
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  const makeApiCall = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const {functionId} = useRouter().query;

  const [currentManageRSVP, setManageRSVP] = useState<Record<string, any>>({});

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchFunctionRSVPList = async () => {
    return await makeApiCall('getFunctionRSVPList', {
      userId: userInfo?.id,
      functionId: functionId as string,
      type: listName
    });
  };

  const handleDownload = async () => {
    setDownload(true);
    const objData = await fetchFunctionRSVPList();
    if (!objData.isError) {
      const csvData = convertToCSV(objData.data);
      downloadCSV(csvData, functionName ? `${functionName}.csv` : 'data.csv');
    }
    setDownload(false);
  };

  const handleManageRSVP = (ele: Record<string, any>) => {
    const currentManageState = functionRSVPType(ele, listName, rsvps);
    setManageRSVP(currentManageState);
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <ManageRSVPModal
          handleCloseModal={handleCloseModal}
          currentManageRSVP={currentManageRSVP}
        />
      )}
      <Card className={styles.cardContainer}>
        <div className={styles.listHeader}>
          <div className={clsx(styles.header, 'text-start fw-bold')}>
            {MemberListingMapping[listName]}
          </div>
          <div className={styles.header}>
            {download ? (
              <Spinner />
            ) : (
              <Image
                src={DownloadButton}
                width={45}
                height={45}
                alt="Download Button"
                className={styles.download}
                onClick={handleDownload}
              />
            )}
          </div>
          <div
            className={clsx(styles.header, styles.emailList, 'text-end')}
            onClick={() => setShowEmailModal(true)}
          >
            EMAIL THIS LIST
          </div>
          {showEmailModal && (
            <EmailListModal setCloseModal={setShowEmailModal} rsvps={rsvps} />
          )}
        </div>
        <div className={styles.listContainer}>
          {rsvps?.[listName]?.list.map((ele: any, index: number) => {
            return (
              <div
                key={ele.profileId}
                className={clsx(
                  index % 2 === 0 && styles.memberBackground,
                  styles.memberList
                )}
              >
                <div className={clsx(styles.list, 'text-start')}>
                  <ProfileNameTooltip name={ele.name} id={ele.profileId} />
                </div>
                <div className={styles.list}>
                  <span>{ele.role} | </span> {ele.timeslot}
                </div>
                <div className={clsx(styles.list, 'text-end')}>
                  <span
                    className={styles.manage}
                    onClick={() => handleManageRSVP(ele)}
                  >
                    {listName !== 'invited' ? 'Manage' : 'Add'} RSVP{' '}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.recordContainer}>
          {rsvps?.[listName]?.count} Records
        </div>
      </Card>
    </>
  );
};
