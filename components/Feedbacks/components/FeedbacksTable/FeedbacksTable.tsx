import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from './FeedbacksTable.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {
  ProfileAvatarTooltip,
  ProfileNameTooltip
} from '@/components/ProfileTooltip';
import {Tooltip} from '@/ds/Tooltip';
import {DATA_ATTRIBS, SURVEY_LABELS} from '@/utils/common/constants';
import clsx from 'clsx';
import useIsTouchScreen from '@/utils/common/useIsTouchScreen';
import {limitString} from '@/utils/common/helper';
import {store} from '@/store';
import {NormalisedFeedback} from '../FeedbacksPage/FeedbacksPage';

interface FeedbacksTableProps {
  feedbacksArr: NormalisedFeedback[];
}

interface TableRowProps {
  row: number;
  data: NormalisedFeedback;
  tableRef: React.RefObject<HTMLDivElement>;
  isTouchScreen: boolean;
  handleDownload: (fileUrl: string, fileName: string) => void;
  checkTooltipActive: (row: number, question: string) => boolean;
  handleActivateTooltip: (row: number, question: string) => () => void;
}

interface UserDetailProps {
  avatarUrl: string;
  profileId: number;
  name: string;
}

interface TooltipCellProps {
  hide: boolean;
  popover: React.ReactNode;
  children: any;
  isActive: boolean;
  tableRef: TableRowProps['tableRef'];
  setActive: () => void;
  isTouchScreen: boolean;
}

enum COLUMN_TYPES {
  USER,
  FILE,
  RATING,
  COMMENT
}

const CONST_FEEDBACK_COMMENT_LENGTH = 85;
const TABLE_COLUMNS = [
  {
    label: 'User',
    type: COLUMN_TYPES.USER
  },
  {
    label: 'Overall Experience',
    type: COLUMN_TYPES.RATING,
    name: SURVEY_LABELS.OVERALL_EXPERIENCE
  },
  {
    label: 'Performance',
    type: COLUMN_TYPES.RATING,
    name: SURVEY_LABELS.PERFORMANCE
  },
  {
    label: 'Navigation & Ease of Use',
    type: COLUMN_TYPES.RATING,
    name: SURVEY_LABELS.NAVIGATION
  },
  {
    label: 'Design & Layout',
    type: COLUMN_TYPES.RATING,
    name: SURVEY_LABELS.DESIGN
  },
  {
    label: 'Mobile Experience',
    type: COLUMN_TYPES.RATING,
    name: SURVEY_LABELS.MOBILE
  },
  {
    label: 'Comments',
    type: COLUMN_TYPES.COMMENT,
    name: SURVEY_LABELS.ADDITIONAL_COMMENT
  },
  {
    label: 'Attachments',
    type: COLUMN_TYPES.FILE
  }
];

export const FeedbacksTable: React.FC<FeedbacksTableProps> = ({
  feedbacksArr
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const isTouchScreen = useIsTouchScreen();
  const [activeTooltip, setActiveTooltip] = useState('');

  useEffect(() => {
    if (isTouchScreen) {
      const onTouch = (e: TouchEvent) => {
        !(e?.target as HTMLElement)?.getAttribute(DATA_ATTRIBS.TOOLTIP) &&
          setActiveTooltip('');
      };

      window.addEventListener('touchstart', onTouch);
      return () => {
        window.removeEventListener('touchstart', onTouch);
      };
    }
  }, []);

  const checkTooltipActive = useCallback(
    (row: number, question: string) => activeTooltip === `${row}-${question}`,
    [activeTooltip]
  );

  const handleActivateTooltip = useCallback(
    (row: number, question: string) => () => {
      setActiveTooltip(`${row}-${question}`);
    },
    []
  );

  const handleDownload = useCallback((fileUrl: string, fileName: string) => {
    store.invokeApi(
      'downloadFile',
      {href: fileUrl, fileName},
      {responseType: 'blob'}
    );
  }, []);

  return (
    <div className={classes.tableDiv} ref={tableRef}>
      <table>
        <thead>
          <tr>
            {TABLE_COLUMNS.map(column => (
              <th key={column.label}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feedbacksArr?.map((data, row) => (
            <TableRow
              key={row}
              row={row}
              data={data}
              tableRef={tableRef}
              isTouchScreen={isTouchScreen}
              handleDownload={handleDownload}
              checkTooltipActive={checkTooltipActive}
              handleActivateTooltip={handleActivateTooltip}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({
  row,
  data,
  tableRef,
  isTouchScreen,
  handleDownload,
  checkTooltipActive,
  handleActivateTooltip
}: TableRowProps) => {
  return (
    <tr>
      {TABLE_COLUMNS.map(column => {
        let cellContent = <>--</>;

        switch (column.type) {
          case COLUMN_TYPES.USER: {
            cellContent = (
              <UserDetails
                name={data.name}
                avatarUrl={data.avatarUrl}
                profileId={data.profileId}
              />
            );
            break;
          }

          case COLUMN_TYPES.RATING:
          case COLUMN_TYPES.COMMENT: {
            const value = data[column.name ?? ''];
            const isComment = column.type === COLUMN_TYPES.COMMENT;
            const isActive = checkTooltipActive(row, column.label);
            const setActive = handleActivateTooltip(row, column.label);
            const hide =
              isComment &&
              value?.answer?.length <= CONST_FEEDBACK_COMMENT_LENGTH;

            if (value) {
              cellContent = (
                <TooltipCell
                  hide={hide}
                  tableRef={tableRef}
                  isActive={isActive}
                  setActive={setActive}
                  popover={<>{value?.answer}</>}
                  isTouchScreen={isTouchScreen}
                >
                  <div
                    className={clsx(
                      classes.tooltipContainer,
                      isComment && classes.comment
                    )}
                  >
                    {isComment ? (
                      limitString(value?.answer, CONST_FEEDBACK_COMMENT_LENGTH)
                    ) : (
                      <>
                        {value?.rating}
                        <FontAwesomeIcon
                          icon={faStar}
                          className={classes.starIcon}
                        />
                      </>
                    )}
                  </div>
                </TooltipCell>
              );
            }
            break;
          }

          case COLUMN_TYPES.FILE: {
            if (data.file?.url) {
              cellContent = (
                <a
                  href={data.file?.url ?? ''}
                  onClick={e => {
                    e.preventDefault();
                    handleDownload(data.file?.url ?? '', data.file?.name ?? '');
                  }}
                >
                  {limitString(data.file?.name, 20) ?? 'Download File'}
                </a>
              );
            }
            break;
          }
        }

        return <td key={column.label}>{cellContent}</td>;
      })}
    </tr>
  );
};

const UserDetails: React.FC<UserDetailProps> = ({
  avatarUrl,
  profileId,
  name
}) => (
  <div className="d-flex align-items-center gap-2">
    <ProfileAvatarTooltip
      center
      imageWidth={45}
      imageHeight={45}
      name={name ?? ''}
      id={profileId ?? ''}
      avatarUrl={avatarUrl ?? ''}
    />
    <ProfileNameTooltip id={profileId} name={name} />
  </div>
);

const TooltipCell: React.FC<TooltipCellProps> = ({
  hide,
  popover,
  children,
  isActive,
  tableRef,
  setActive,
  isTouchScreen
}) => {
  if (hide) return children;
  return (
    <Tooltip
      flip
      popover={popover}
      placement="bottom"
      container={tableRef}
      containerClass={classes.tooltip}
      mode={isTouchScreen ? 'click' : 'hover'}
      show={isTouchScreen ? isActive : undefined}
      setShow={isTouchScreen ? setActive : undefined}
      popoverClass={clsx(classes.tooltipPopover, 'position-absolute')}
    >
      {children}
    </Tooltip>
  );
};
