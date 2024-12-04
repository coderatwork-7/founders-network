import Card from '@/ds/Card/card';
import {MemberListingMapping} from '../FunctionRSVPCount/functionRSVPCount';
import clsx from 'clsx';
import styles from './emailEdit.module.scss';
import {useState} from 'react';
import {TextEditor} from './FunctionTextEditor/textEditior';
import {Button, ButtonVariants} from '@/ds/Button';
import test from 'node:test';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

interface EmailEditPropsTypes {
  userList: Record<string, any>;
  setUserList: any;
  includePartner: boolean;
  setIncludePartner: any;
  setCurrentMode: any;
  emailData: Record<string, string>;
  setEmailData: any;
  handleSubmit: any;
  loading: Record<string, boolean>;
}

export const EmailEdit: React.FC<EmailEditPropsTypes> = ({
  setCurrentMode,
  includePartner,
  setIncludePartner,
  userList,
  setUserList,
  emailData,
  setEmailData,
  handleSubmit,
  loading
}) => {
  const [currentDropdown, setCurrentDropdown] = useState<string>('none');
  const isMobile = Breakpoint.mobile == useBreakpoint();
  return (
    <div className={clsx('d-flex gap-5 mt-3', isMobile && 'flex-column')}>
      <div className={styles.leftPanel}>
        {userList &&
          Object.keys(userList).map((ele: string) => {
            if (ele == 'total') return;
            const name = MemberListingMapping[ele];
            const list = userList[ele]?.list;
            return (
              <div key={name}>
                <Card className={clsx(styles.listingCard)}>
                  <div
                    onClick={() => {
                      if (currentDropdown == name) {
                        setCurrentDropdown('none');
                      } else {
                        setCurrentDropdown(name);
                      }
                    }}
                    className={clsx(
                      styles.listingName,
                      userList?.[ele]?.isChecked ||
                        userList?.[ele]?.list?.some(
                          (people: Record<string, any>) =>
                            people?.isPeopleChecked
                        )
                        ? 'fw-bold'
                        : styles.notSelected
                    )}
                  >
                    {name}
                  </div>
                  <div className="px-2">
                    <input
                      className={clsx(styles.checkBox)}
                      type="checkbox"
                      onChange={e => {
                        const inputTagName = e.target.name;
                        const isTagChecked = e?.target?.checked;
                        if (isTagChecked) {
                          setUserList((prev: Record<string, any>) => ({
                            ...prev,
                            [inputTagName]: {
                              list: list.map(
                                (element: Record<string, any>) => ({
                                  ...element,
                                  isPeopleChecked: true
                                })
                              ),
                              isChecked: true
                            },
                            total: prev.total + list.length
                          }));
                        } else {
                          const removeLength = userList[ele]?.list.filter(
                            (element: Record<string, any>) =>
                              element?.isPeopleChecked
                          ).length;

                          setUserList((prev: Record<string, any>) => {
                            return {
                              ...prev,
                              [inputTagName]: {
                                list: list.map(
                                  (element: Record<string, any>) => ({
                                    ...element,
                                    isPeopleChecked: false
                                  })
                                ),
                                isChecked: false
                              },
                              total: prev.total - removeLength
                            };
                          });
                        }
                      }}
                      name={ele}
                      checked={
                        userList?.[ele]?.isChecked ||
                        userList?.[ele]?.list?.some(
                          (people: Record<string, any>) =>
                            people?.isPeopleChecked
                        )
                      }
                    />
                  </div>
                </Card>
                {list && currentDropdown == name && (
                  <div className={styles.dropdown}>
                    {list.map((people: Record<string, any>) => {
                      return (
                        <div key={people?.profileId}>
                          <Card className="px-2 py-2 d-flex">
                            <div className={styles.list}>{people.name}</div>
                            <div>
                              <input
                                type="checkbox"
                                onChange={e => {
                                  const isCurrentPeopleChecked =
                                    e.target.checked;
                                  const peopleList = list;
                                  const currentIndex = list.findIndex(
                                    (element: Record<string, any>) =>
                                      element.profileId == people.profileId
                                  );
                                  if (isCurrentPeopleChecked) {
                                    peopleList[currentIndex].isPeopleChecked =
                                      true;
                                    setUserList(
                                      (prev: Record<string, any>) => ({
                                        ...prev,
                                        [ele]: {
                                          list: peopleList,
                                          isChecked: prev[ele]?.isChecked
                                        },
                                        total: prev.total + 1
                                      })
                                    );
                                  } else {
                                    peopleList[currentIndex].isPeopleChecked =
                                      false;
                                    setUserList(
                                      (prev: Record<string, any>) => ({
                                        ...prev,
                                        [ele]: {
                                          list: peopleList,
                                          isChecked: prev[ele]?.isChecked
                                        },
                                        total: prev.total - 1
                                      })
                                    );
                                  }
                                }}
                                checked={people?.isPeopleChecked}
                              />
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        <div className="mt-4 text-uppercase">
          <div>
            Total recipients: <span>{userList.total}</span>
          </div>
          <div className="mt-1">
            auto save: <span>{'on'}</span>
          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <TextEditor emailData={emailData} setEmailData={setEmailData} />
        <div
          className={clsx(
            'mt-3 d-flex justify-content-between',
            isMobile && 'flex-column gap-3'
          )}
        >
          <Card className={clsx(styles.partnerContainer, isMobile && 'w-100')}>
            <div>Include Investors and/or Partners in this email?</div>
            <div className={'d-flex gap-2'}>
              <div
                className={clsx(
                  styles.include,
                  'mx-2',
                  includePartner && styles.includeActive
                )}
                onClick={() => setIncludePartner(true)}
              >
                Yes
              </div>
              <div
                className={clsx(
                  styles.include,
                  !includePartner && styles.includeActive
                )}
                onClick={() => setIncludePartner(false)}
              >
                No
              </div>
            </div>
          </Card>

          <input
            className={clsx(styles.sendMail, isMobile && 'w-100 mx-0')}
            type="email"
            placeholder="Send Mail"
            value={emailData?.testMail}
            onChange={e => {
              setEmailData((prev: Record<string, string>) => ({
                ...prev,
                testMail: e.target.value
              }));
            }}
          />
        </div>
        <div className="mt-4 d-flex justify-content-end gap-3">
          <Button
            className={styles.sendTest}
            variant={ButtonVariants.OutlineTertiary}
            onClick={() => handleSubmit(true)}
            disabled={loading.testMail}
            loading={loading.testMail}
          >
            Send Test
          </Button>
          <Button
            variant={ButtonVariants.BluePrimary}
            onClick={() => setCurrentMode('preview')}
          >
            Preview
          </Button>
          <Button
            variant={ButtonVariants.BluePrimary}
            onClick={() => handleSubmit(false)}
            disabled={loading.sendMail}
            loading={loading.sendMail}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
