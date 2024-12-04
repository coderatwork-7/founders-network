import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import React, {useState, FormEvent, useEffect} from 'react';
import {Modal} from 'react-bootstrap';
import styles from './addRSVPModal.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import {
  selectAllMembersList,
  selectFunctionDeclineReasons,
  selectUserInfo
} from '@/store/selectors';
import {useRouter} from 'next/router';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {toast} from 'react-toastify';
import {isObjectEmpty} from '@/utils/common/helper';
import {functionRSVPType} from '../FunctionRSVPList/functionRSVPList';

interface AddRSVPModalPropTypes {
  setCloseModal: any;
  rsvps: Record<string, any>;
  setCurrentRSVP: any;
  setManageModal: any;
}

const typeOptions: Record<string, string>[] = [
  {name: 'Attending In Person', value: 'attending'},
  {name: 'Dialing In', value: 'dialin'},
  {name: 'Decline ', value: 'decline'}
];

export const AddRSVPModal: React.FC<AddRSVPModalPropTypes> = ({
  setCloseModal,
  setCurrentRSVP,
  setManageModal,
  rsvps
}) => {
  const isMobile = Breakpoint.mobile == useBreakpoint();
  const userInfo = useSelector(selectUserInfo());
  const [manageRSVPModal, setManageRSVPModal] = useState<string>('');
  const {functionId} = useRouter().query;
  const makeApiCall = useAPI();
  const declineReasons = useSelector(selectFunctionDeclineReasons());
  const [loading, setLoading] = useState({
    remove: false,
    submit: false
  });
  const allMembers = useSelector(selectAllMembersList());
  const [mode, setMode] = useState<string>('Member');
  const [formDetail, setFormDetail] = useState<Record<string, any>>({
    isCharged: true,
    reason: '',
    otherReason: '',
    isNominate: false
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setManageModal('');
    setLoading(prev => ({...prev, submit: true}));
    let isFound: Record<string, any> = {};
    Object.keys(rsvps).forEach((ele: string) => {
      const found = rsvps[ele]?.list.find(
        (person: Record<string, any>) =>
          person.profileId == formDetail.profileId
      );

      if (found) {
        isFound = functionRSVPType(found, ele, rsvps);
      }
    });

    if (!isObjectEmpty(isFound)) {
      toast.error('Member already exists', {position: 'top-center'});
      setCurrentRSVP({...isFound});
      setManageRSVPModal(isFound.profileDetail.name);
      setLoading(prev => ({...prev, submit: false}));
      return;
    }

    const data: Record<string, any> = {};
    data.isCharged = formDetail.isCharged;
    data.profileId = formDetail.profileId;
    data.reason = formDetail.reason;
    data.otherReason = formDetail.otherReason;
    data.type = formDetail.type;
    data.isGuest = false;
    data.charge = '$0.00';
    if (mode == 'Guest') {
      data.isNominate = formDetail.isNominate;
      data.fullName = formDetail.fullName;
      data.email = formDetail.email;
      data.isGuest = true;
    }
    await makeApiCall(
      'postFunctionAddRSVP',
      {
        userId: userInfo?.id,
        functionId: functionId
      },
      {
        method: 'POST',
        data
      }
    )
      .then(e => {
        if (e?.data?.exists) {
          toast.success(e.data.exists, {position: 'top-center'});
        } else {
          toast.success('Added succesfully', {position: 'top-center'});
        }
      })
      .catch(_ => {
        toast.error('Error while adding RSVP, Please try again Later', {
          position: 'top-center'
        });
      });

    setLoading(prev => ({...prev, submit: false}));
  };

  const handleRemove = async () => {
    setLoading(prev => ({...prev, remove: true}));
    let isError = false;
    if (mode != 'Member') {
      toast.error('Switch Mode to Member to remove Members', {
        position: 'top-center'
      });
      isError = true;
    }
    if (formDetail?.rsvpMember) {
      toast.error('Select Member to remove from invite list', {
        position: 'top-center'
      });
      isError = true;
    }

    if (formDetail.reason) {
      toast.error('There needs to reason for removing a member', {
        position: 'top-center'
      });
      isError = true;
    }
    const isExist = rsvps['invited'].list?.find(
      (ele: Record<string, any>) => ele.profileId == formDetail.profileId
    );

    if (!isExist) {
      toast.error('Current Member doesnot exist in invite list', {
        position: 'top-center'
      });
      isError = true;
    }

    const data: Record<string, any> = {};
    data.profileId = formDetail.rsvpMember;
    data.type = formDetail.rsvpMember;
    data.reason = formDetail.reason;
    data.otherReason = formDetail.otherReason;
    data.isGuest = false;

    if (!isError)
      await makeApiCall(
        'postFunctionRemoveMember',
        {
          userId: userInfo?.id,
          functionId: functionId
        },
        {
          method: 'POST',
          data
        }
      )
        .then(_ =>
          toast.success(`${isExist?.name ?? 'Member'} is Succesfully Removed`, {
            position: 'top-center'
          })
        )
        .catch(_ => {
          toast.error(
            `Error while removing ${
              isExist?.name ?? 'Member'
            } , Please Try Again Later`,
            {
              position: 'top-center'
            }
          );
        });

    setLoading(prev => ({...prev, remove: false}));
  };

  const fetchDeclineReasons = async () => {
    await makeApiCall('getFunctionDeclineReasons', {
      userId: userInfo?.id,
      functionId: functionId as string,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };
  const fetchAllMembersList = async () => {
    await makeApiCall('getAllMembersList', {
      userId: userInfo?.id,
      functionId: functionId as string,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  useEffect(() => {
    if (userInfo && !declineReasons) {
      fetchDeclineReasons();
    }

    if (userInfo && !allMembers) {
      fetchAllMembersList();
    }
  }, [userInfo?.id, functionId]);

  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal
      show={true}
      dialogClassName={styles.modal}
      contentClassName={styles.content}
      centered={!isMobile}
      fullscreen={isMobile ? true : undefined}
      onHide={() => setCloseModal(false)}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className={styles.modalTitle}>Add More RSVP's</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <span
              className={styles.mode}
              onClick={() => setMode(mode === 'Member' ? 'Guest' : 'Member')}
            >
              Switch to {mode === 'Member' ? 'Guest' : 'Member'}
            </span>
          </div>
          {mode == 'Guest' && (
            <>
              <div className="my-2">
                <label className={styles.labelHeader}>full name</label>
                <div>
                  <input
                    className={styles.textField}
                    type="text"
                    required
                    name="fullName"
                    onChange={e => handleOnChange(e)}
                  />
                </div>
              </div>
              <div>
                <label className={styles.labelHeader}>email</label>
                <div>
                  <input
                    className={styles.textField}
                    type="email"
                    required
                    name="email"
                    onChange={e => handleOnChange(e)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="my-2">
            <label className={styles.labelHeader}>
              {mode == 'Guest' && 'guest of'} member:
            </label>
            <Select
              options={allMembers?.map(
                (value: Record<string, number | string>) => {
                  return {
                    label: value?.name,
                    value: value?.profileId
                  };
                }
              )}
              name="profileId"
              onChange={(ele: any) => {
                setFormDetail(prev => ({...prev, ['profileId']: ele?.value}));
              }}
              required
            />
          </div>
          <div className="my-2">
            <label className={styles.labelHeader}>type</label>
            <Select
              options={typeOptions.map(options => {
                return {
                  label: options.name,
                  value: options.value
                };
              })}
              name="type"
              required
              onChange={ele => {
                setFormDetail(prev => ({...prev, ['type']: ele?.value}));
              }}
            />
          </div>
          {(formDetail?.type == 'Maybe' || formDetail?.type == 'Decline') && (
            <>
              <div className="my-2">
                <label className={styles.labelHeader}>Reasons</label>
                <div>
                  <Select
                    options={declineReasons?.map((ele: Record<string, any>) => {
                      return {
                        label: ele?.name,
                        value: ele
                      };
                    })}
                    onChange={e => {
                      setFormDetail(prev => ({
                        ...prev,
                        reason: e
                      }));
                    }}
                  />
                </div>
              </div>
              <div>
                <label className={styles.labelHeader}>Other Reasons</label>
                <div>
                  <input
                    className={styles.textField}
                    type="text"
                    name="otherReasons"
                    onChange={e => handleOnChange(e)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="d-flex gap-3">
            <div className="my-2">
              <label className={styles.labelHeader}>charge:-</label>
              <input
                type="checkbox"
                className="mx-1"
                checked={formDetail.isCharged}
                onChange={e => {
                  setFormDetail(prev => ({
                    ...prev,
                    isCharged: e.target.checked
                  }));
                }}
              />
            </div>
            {mode === 'Guest' && (
              <div className="my-2">
                <label className={styles.labelHeader}>nominate:-</label>
                <input
                  className="mx-1"
                  type="checkbox"
                  onChange={e => {
                    setFormDetail(prev => ({
                      ...prev,
                      isNominate: e.target.checked
                    }));
                  }}
                />
              </div>
            )}
          </div>
          {manageRSVPModal && (
            <div
              className={styles.warning}
              onClick={() => setManageModal(true)}
            >
              Click Here to handle {manageRSVPModal} Manage Modal
            </div>
          )}
          <div className="d-flex justify-content-end gap-4 my-3">
            <Button
              variant={ButtonVariants.BluePrimary}
              onClick={handleRemove}
              textUppercase
              disabled={loading.remove}
              loading={loading.remove}
            >
              Remove from Invite List
            </Button>

            <Button
              variant={ButtonVariants.BluePrimary}
              type="submit"
              textUppercase
              disabled={loading.submit}
              loading={loading.submit}
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
