import clsx from 'clsx';
import Link from 'next/link';
import classes from '../createForumFeed.module.scss';

export const ModerationInfoBar: React.FC = () => {
  return (
    <div
      className={clsx(
        'border',
        'border-1',
        'rounded-1',
        'mb-2',
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'fs-6',
        'p-3'
      )}
    >
      <i className={classes['moderation-icon']}></i>
      <div>
        Your post will be automatically moderated by the staff.
        <Link href={`guidelines/#moderation`}> Learn Why</Link>
      </div>
    </div>
  );
};
