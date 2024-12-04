import {useEffect, useRef, useState} from 'react';
import classes from './forumContent.module.scss';
import Link from 'next/link';
import Parse from 'html-react-parser';
import clsx from 'clsx';
import {removePrefixFromId} from '@/utils/common/helper';
import {FEEDS_TYPE} from '@/utils/common/constants';
import DOMPurify from 'isomorphic-dompurify';
import {processAnchorTagAndEmoji} from '@/utils/common/help';

interface ForumContentProps {
  title: string;
  content: string;
  threadId: string;
  expanded?: boolean;
  authorDetails?: any;
  threeDotMenu?: any;
}

export default function ForumContent({
  title,
  content,
  threadId,
  expanded = false,
  authorDetails,
  threeDotMenu
}: ForumContentProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);
  const [readMore, setReadMore] = useState(false);
  useEffect(() => {
    if ((contentRef.current?.offsetHeight || 0) > 200 && !expanded) {
      setReadMore(true);
      contentRef.current!.style.maxHeight = '200px';
    }
  }, []);
  function maximize() {
    contentRef.current!.style.maxHeight = '1000000px';
    contentRef.current!.style.overflowY = 'auto';
    setReadMore(false);
  }

  return (
    <>
      {expanded ? (
        <>
          <div className="d-flex">
            <h3 className={classes.titleExpanded}>{title}</h3>
            {threeDotMenu}
          </div>
          {authorDetails}
        </>
      ) : (
        <Link href={`/forum/${threadId}`} className={classes.title}>
          {title}
        </Link>
      )}
      <div
        className={clsx([classes.content, expanded && classes.expanded])}
        ref={contentRef}
      >
        {Parse(
          DOMPurify.sanitize(content, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
          }),
          {replace: processAnchorTagAndEmoji}
        )}
      </div>
      {readMore && (
        <div className={classes.readmore} onClick={maximize}>
          Read More
        </div>
      )}
    </>
  );
}
