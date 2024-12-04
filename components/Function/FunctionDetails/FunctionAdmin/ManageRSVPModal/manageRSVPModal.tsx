import React, {FormEvent, useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import styles from './manageRSVPModal.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import Card from '@/ds/Card/card';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import {selectFunctionDeclineReasons, selectUserInfo} from '@/store/selectors';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import useAPI from '@/utils/common/useAPI';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';

interface ManageRSVPModalPropType {
  handleCloseModal: () => void;
  currentManageRSVP: Record<string, any>;
}

const AttendType: Record<string, string>[] = [
  {name: 'attending', value: 'attending'},
  {name: 'dialin', value: 'dialin'},
  {name: 'declined', value: 'declined'},
  {name: 'invited', value: 'invited'}
];

export const ManageRSVPModal: React.FC<ManageRSVPModalPropType> = ({
  handleCloseModal,
  currentManageRSVP
}) => {
  const isMobile = Breakpoint.mobile == useBreakpoint();
  const userDetail = currentManageRSVP?.profileDetail;
  const type = currentManageRSVP?.type;
  const [currentType, setCurrentType] = useState<string>(type);
  const [loading, setLoading] = useState<boolean>(false);
  const userInfo = useSelector(selectUserInfo());
  const makeApiCall = useAPI();
  const {functionId} = useRouter().query;
  const declineReasons = useSelector(selectFunctionDeclineReasons());

  const [formData, setFormaData] = useState<Record<string, any>>({
    newRSVP: type,
    reason: '',
    newReason: '',
    isCharged: false
  });

  const fetchDeclineReasons = async () => {
    await makeApiCall('getFunctionDeclineReasons', {
      userId: userInfo?.id,
      functionId: functionId as string,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  useEffect(() => {
    if (userInfo?.id && functionId && !declineReasons) fetchDeclineReasons();
  }, [userInfo?.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (currentType == type) {
      toast.error('New RSVP cannot be same as Old RSVP', {
        position: 'top-center'
      });
      return;
    }

    const data: Record<string, any> = {...formData};
    data.profileId = userDetail.profileId;
    data.newRSVP = currentType;
    data.reason = '';
    data.newReason = '';
    if (currentType == 'declined') {
      data.reason = formData.reason;
      data.newReason = formData.newReason;
    }
    if (currentType == 'dialin') {
      data.newRSVP = 'dialiningIn';
    }
    console.log(data, '@@');

    await makeApiCall(
      'postFunctionManageRSVP',
      {
        userId: userInfo?.id,
        functionId: functionId as string,
        userDetail
      },
      {
        method: 'POST',
        data
      }
    )
      .then(e => {
        toast.success('Successful', {position: 'top-center', theme: 'dark'});
      })
      .catch(e => {
        toast.error('Error: Please try again later', {
          position: 'top-center',
          theme: 'dark'
        });
      });
    setLoading(false);
    handleCloseModal();
  };

  return (
    <Modal
      show={true}
      dialogClassName={styles.modal}
      contentClassName={styles.content}
      centered={!isMobile}
      fullscreen={isMobile ? true : undefined}
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className={styles.modalTitle}>
          {type == 'invited' ? 'Add' : 'Manage'} RSVP for {userDetail.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form onSubmit={handleSubmit}>
          <div>
            <h5 className="text-uppercase fw-bold mb-3">current rsvp</h5>
            <Card className={styles.currentCard}>{userDetail?.role}</Card>
          </div>
          <div className="d-flex justify-content-center align-items-center my-3">
            <FontAwesomeIcon icon={faArrowDown} className={styles.downArrow} />
          </div>
          <div className="my-3">
            <h5 className="text-uppercase fw-bold mb-3">new rsvp</h5>
            <div className="d-flex gap-2">
              {...AttendType.map(elem => {
                const item = elem.value;
                const name = elem.name;
                if (type != 'invited' && item == 'invited') return;
                return (
                  <Card
                    key={item}
                    className={clsx(
                      styles.newCard,
                      'text-capitalize',
                      styles[item]
                    )}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center px-2 py-2"
                      onClick={() => setCurrentType(item)}
                    >
                      <div className={clsx(item == currentType && 'fw-bold')}>
                        {name}
                      </div>
                      <div>
                        <div
                          className={clsx(
                            styles.tick,
                            item == currentType && styles.filledTick
                          )}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {currentType == 'declined' && (
            <div className="mt-5 mb-3">
              <h6 className="fw-bold text-uppercase">Reason</h6>
              <div>
                <Select
                  options={declineReasons?.map(
                    (item: Record<string, number | string>) => ({
                      label: item.name,
                      value: item
                    })
                  )}
                  onChange={(e: any) => {
                    setFormaData(prev => ({
                      ...prev,
                      reason: e.value
                    }));
                  }}
                  required
                />

                <div className="my-3">
                  <input
                    type="text"
                    className={styles.newReason}
                    placeholder="Type new reason"
                    name="newReason"
                    onChange={ele => {
                      const value: string = ele.target.value;
                      const name: string = ele.target.name;
                      setFormaData(prev => ({...prev, [name]: value}));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div>
              Change RSVP to{' '}
              <span className="text-capitalize">{currentType}</span>
            </div>
            <div className="d-flex gap-2">
              <span>Changes will not refund or change</span>
              {(currentType == 'attending' || currentType == 'dialin') && (
                <div>
                  <input
                    type="checkbox"
                    className="mx-1"
                    name="isCharged"
                    onChange={ele => {
                      const value: boolean = ele.target.checked;
                      const name: string = ele.target.name;
                      setFormaData(prev => ({...prev, [name]: value}));
                    }}
                  />
                  <span>Charge</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Button
              variant={ButtonVariants.BluePrimary}
              className="w-100 mt-3"
              textUppercase
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
