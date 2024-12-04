import {Button, ButtonVariants} from '@/ds/Button';
import React from 'react';
import styles from './previewEmail.module.scss';
import clsx from 'clsx';
import Card from '@/ds/Card/card';
import Parse from 'html-react-parser';
import {processAnchorTagAndEmoji} from '@/utils/common/help';
import DOMPurify, {sanitize} from 'isomorphic-dompurify';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

interface PreviewEmailPropType {
  userList: Record<string, any>;
  setCurrentMode: any;
  emailData: Record<string, string>;
  handleSubmit: any;
  loading: Record<string, boolean>;
}

export const mergeList = (userList: Record<string, any>) => {
  const allList = Object.keys(userList)
    .map(ele => userList[ele].list)
    .flatMap(ele => {
      if (!ele) return;
      return ele.filter((item: Record<string, any>) => item.isPeopleChecked);
    });
  return allList;
};

export const PreviewEmail: React.FC<PreviewEmailPropType> = ({
  userList,
  setCurrentMode,
  emailData,
  handleSubmit,
  loading
}) => {
  const allAttendList = mergeList(userList);
  const isMobile = Breakpoint.mobile == useBreakpoint();
  return (
    <div className={clsx('d-flex mt-3 gap-5', isMobile && 'flex-column')}>
      <div className={styles.leftPanel}>
        <div className={styles.panelList}>
          {allAttendList?.map((people, index) => {
            if (!people) return;
            return (
              <div
                className={clsx(
                  index % 2 && styles.oddPeople,
                  styles.peopleList
                )}
              >
                {people.name}
              </div>
            );
          })}
        </div>
        <div className="text-uppercase mt-3">
          Total Recipients: {userList?.total}
        </div>
      </div>
      <div className={styles.rightPanel}>
        <Card className={clsx('px-5 py-5', styles.editor)}>
          <div>
            {Parse(
              DOMPurify.sanitize(sanitize(emailData?.editor), {
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
        </Card>

        <div className="d-flex gap-3 justify-content-end mt-3">
          <Button
            variant={ButtonVariants.BluePrimary}
            onClick={() => setCurrentMode('edit')}
          >
            Back to Edit
          </Button>

          <Button
            variant={ButtonVariants.BluePrimary}
            onClick={() => handleSubmit(false)}
            disabled={loading.sendMail}
            loading={loading.sendMail}
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
};
