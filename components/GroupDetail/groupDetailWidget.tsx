import {GroupDetails} from '@/pages/group/[groupId]';
import classes from './groupDetailWidget.module.scss';
import {Divider} from '@/ds/Divider';
import clsx from 'clsx';
import {CollapsibleContent} from '@/ds/CollapsibleContent';
import Parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import {processAnchorTagAndEmoji} from '@/utils/common/help';
export function GroupDetailWidget({data}: {data: GroupDetails}) {
  return (
    <div className={clsx(classes.container, 'container-border bg-white ')}>
      <div className={classes.background}>
        <p className={clsx(classes.bold, 'restrict1Line')}>
          {data?.title ?? 'Group title'}
        </p>
        <a
          href={`mailto:${data?.email}`}
          className={clsx(classes.email, 'restrict2Lines linkText')}
        >
          {data?.email ?? 'email'}
        </a>
      </div>
      <Divider className="m-0" />
      {(data?.description ?? 'Description') && (
        <CollapsibleContent
          mainContent={
            <p
              className={clsx(
                'p-1',
                classes.description,
                data?.description === 'No description' && 'text-center'
              )}
            >
              {Parse(DOMPurify.sanitize(data?.description ?? 'Description'), {
                replace: processAnchorTagAndEmoji
              })}
            </p>
          }
          maxHeight={105}
          readMoreClassName="ps-1"
        />
      )}
      <Divider className="m-0" />
    </div>
  );
}
