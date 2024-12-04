import React, {useCallback, useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import styles from './emailListModal.module.scss';
import CloseButton from '@/public/icons/close-btn.png';
import Image from 'next/image';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {EmailEdit} from '../EmailEdit/emailEdit';
import {PreviewEmail, mergeList} from '../PreviewEmail/previewEmail';
import {useDispatch, useSelector} from 'react-redux';
import {selectCacheData, selectUserInfo} from '@/store/selectors';
import {CacheType, cacheData} from '@/store/reducers/userSlice';
import useAPI from '@/utils/common/useAPI';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';

const ccTemplate =
  'Paul Anda <paul@foundersnetwork.com>, Mike Mack <mike@fract.com>, Diego Villarreal <diego@castor.app>, Domingo Guerra <dguerra@appthority.com>, Alex Bagden <alex.bagden@roostergrin.com>, Kevin Holmes <kholmes@foundersnetwork.com>, David Ordal <david@ordal.com>';

interface EmailListModalPropsTypes {
  setCloseModal: any;
  rsvps: Record<string, any>;
}

const ErrorMapping = {
  testMail: 'Test Mail',
  cc: 'CC',
  subject: 'Subject',
  editor: 'Text Editor'
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const EmailListModal: React.FC<EmailListModalPropsTypes> = ({
  setCloseModal,
  rsvps
}) => {
  const dispatch = useDispatch();
  const {functionId} = useRouter().query;
  const [loading, setLoading] = useState<Record<string, boolean>>({
    testMail: false,
    sendMail: false
  });
  const makeApiCall = useAPI();
  const isMobile = Breakpoint.mobile == useBreakpoint();
  const userInfo = useSelector(selectUserInfo());
  const editorTemplate = `<p>-- <br /> Best,<br /> ${userInfo?.name}<br /> ${userInfo?.title}<br /> <a style="color: #15c;" href="https://foundersnetwork.com">www.foundersnetwork.com</a><br /> founders helping founders &reg;<br /> <img src="https://foundersnetwork.com/img/logo.png" /></p>`;
  const [currentMode, setCurrentMode] = useState<string>('edit');
  const [includePartner, setIncludePartner] = useState(false);
  const preSavedData = useSelector(
    selectCacheData(CacheType.functionEmailListing)
  );
  const emailTemplate = {
    subject: '',
    cc: ccTemplate,
    editor: editorTemplate,
    testMail: ''
  };
  const [emailData, setEmailData] = useState<Record<string, string>>(
    preSavedData?.[functionId as string] ?? emailTemplate
  );
  const [userList, setUserList] = useState<Record<string, any>>({
    ...Object.keys(rsvps).reduce((acc: Record<string, any>, ele: string) => {
      if (rsvps[ele]?.list?.length > 0) {
        acc[ele] = {
          list: rsvps[ele]?.list?.map((element: Record<string, any>) => ({
            ...element,
            isPeopleChecked: false
          })),
          isChecked: false
        };
      }
      return acc;
    }, {}),
    all: {
      list: rsvps['all']?.list?.map((ele: Record<string, any>) => ({
        ...ele,
        isPeopleChecked: true
      })),
      isChecked: true
    },
    total: rsvps['all'].list.length
  });

  const postFunctionEmailListing = async (postData: Record<string, any>) => {
    if (userInfo?.id && functionId)
      await makeApiCall(
        'postFunctionEmailListing',
        {
          userId: userInfo?.id,
          functionId: functionId as string
        },
        {
          method: 'POST',
          data: postData
        }
      )
        .then(e => {
          toast.success(e.data.message, {
            position: 'top-center',
            theme: 'dark'
          });
          dispatch(
            cacheData({
              [CacheType.functionEmailListing]: {
                ...preSavedData,
                [functionId as string]: emailTemplate
              }
            })
          );
        })
        .catch(e => {
          toast.error('Error while submitting please try again later', {
            position: 'top-center',
            theme: 'dark'
          });
        });
  };

  const handleSubmit = async (isTest: boolean = false) => {
    if (isTest) {
      setLoading({
        testMail: true,
        sendMail: false
      });
    } else {
      setLoading({
        testMail: false,
        sendMail: true
      });
    }
    let isError = false;
    Object.keys(emailData).forEach(key => {
      const value = emailData[key];

      if (isTest && key === 'testMail') {
        if (!isValidEmail(value)) {
          toast.error(`Invalid email for Test Mail`, {
            position: 'top-center'
          });
          isError = true;
        } else if (
          emailData.subject.trim() === '' ||
          emailData.editor.trim() === ''
        ) {
          toast.error(`Subject or Text Editor cannot be empty for Mail`, {
            position: 'top-center',
            theme: 'dark'
          });
          isError = true;
        }
      }
      if (!isTest && (key === 'cc' || key === 'subject' || key === 'editor')) {
        if (value.trim() === '') {
          toast.error(`${ErrorMapping[key]} cannot be empty`, {
            position: 'top-center',
            theme: 'dark'
          });
          isError = true;
        }
      }
    });
    if (isError) {
      setLoading({
        testMail: false,
        sendMail: false
      });

      return;
    }

    const postData: Record<string, any> = {
      subject: emailData?.subject,
      emailBody: emailData?.editor,
      includePartner,
      userList: mergeList(userList)
        .filter(ele => ele)
        .map(ele => ele?.profileId)
    };
    if (isTest) {
      postData.emailTo = [emailData.testMail];
    } else {
      postData.emailTo = [emailData.cc.split(',')];
    }

    await postFunctionEmailListing(postData);

    setLoading({
      testMail: false,
      sendMail: false
    });
  };

  const handleCloseModal = useCallback(() => {
    dispatch(
      cacheData({
        [CacheType.functionEmailListing]: {
          ...preSavedData,
          [functionId as string]: emailData
        }
      })
    );
    setCloseModal(false);
  }, [emailData]);

  return (
    <Modal show={true} fullscreen={true} onHide={handleCloseModal}>
      <Modal.Body className={styles.modalBody}>
        <div
          className={clsx(
            'position-absolute',
            styles['close-btn'],
            isMobile && styles.mobile
          )}
        >
          <Image
            src={CloseButton}
            className={styles.closeIcon}
            width={30}
            height={30}
            alt="Close Button"
            onClick={handleCloseModal}
          />
        </div>
        <div className={clsx('d-flex', 'w-100', isMobile ? 'py-3' : 'p-4')}>
          <div
            className={clsx(
              'w-100',
              'd-flex',
              'flex-column',
              styles.container,
              isMobile ? 'w-100' : 'mx-auto'
            )}
          >
            <div>
              <h3 className="mb-1"> Group Email</h3>
              <h6 className={clsx('text-uppercase')}>
                send the following lists
              </h6>
            </div>
            {currentMode == 'edit' && (
              <EmailEdit
                includePartner={includePartner}
                setIncludePartner={setIncludePartner}
                userList={userList}
                setUserList={setUserList}
                setCurrentMode={setCurrentMode}
                emailData={emailData}
                setEmailData={setEmailData}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
            {currentMode == 'preview' && (
              <PreviewEmail
                emailData={emailData}
                setCurrentMode={setCurrentMode}
                userList={userList}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
