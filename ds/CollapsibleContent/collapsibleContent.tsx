import {useCallback, useEffect, useRef, useState} from 'react';
import classes from './collapsibleContent.module.scss';
import clsx from 'clsx';
interface CollapsibleContentProps {
  mainContent: JSX.Element;
  maximizedJSX?: JSX.Element;
  maxHeight?: number;
  readMoreClassName?: string;
}

export function CollapsibleContent({
  mainContent,
  maximizedJSX,
  maxHeight = 0,
  readMoreClassName
}: CollapsibleContentProps) {
  const [minimized, setMinimized] = useState(true);
  const [noCollapse, setNoCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const minimize = useCallback(() => setMinimized(true), []);
  const maximize = useCallback(() => setMinimized(false), []);

  useEffect(() => {
    if ((contentRef.current?.offsetHeight ?? 0) < maxHeight) {
      setNoCollapse(true);
    }
  }, []);
  return (
    <>
      {minimized ? (
        <div
          style={{maxHeight: `${maxHeight || 1000000}px`, overflow: 'hidden'}}
          ref={contentRef}
        >
          {mainContent}
        </div>
      ) : (
        maximizedJSX ?? mainContent
      )}

      {!noCollapse && (
        <div
          className={clsx(classes.readMore, 'cursorPointer', readMoreClassName)}
          onClick={minimized ? maximize : minimize}
        >
          {minimized ? 'Read More' : 'Minimize'}
        </div>
      )}
    </>
  );
}
