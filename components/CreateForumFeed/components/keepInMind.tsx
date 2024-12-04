import clsx from 'clsx';
import Link from 'next/link';
import classes from '../createForumFeed.module.scss';

export const KeepInMind = () => {
  return (
    <div
      id="KeepInMind"
      className={clsx('d-flex', 'flex-column', 'p-3', classes['keep-in-mind'])}
    >
      <h5>Friendly Reminders</h5>
      <div>
        <b>Search first</b>: search forums first before posting.
      </div>
      <div>
        <b>No Selling or Spamming</b>: think of FN as a board of advisors.
      </div>
      <div>
        <b>Close the loop</b>: circle back with your decision/results.
      </div>
      <div>
        <b>@Mention</b> to notify and include another member in your post.
      </div>
      <div>
        <b>Learn more:</b> Check out our{' '}
        <a href="guidelines" target="_blank" className="text-primary">
          Forum Guidelines
        </a>
        .
      </div>
    </div>
  );
};
