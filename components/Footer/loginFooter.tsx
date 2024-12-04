import React, {useEffect, useState} from 'react';
import classes from './loginFooter.module.scss';
import {
  NOT_MEMBER_TEXT,
  LEARN_MORE_URL,
  LEARN_MORE_TEXT
} from '@/utils/common/constants';

export const LoginFooter = function () {
  const [isViewportTooSmall, setIsViewportTooSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;

      // Define a threshold as half of the viewport height
      const threshold = 600;

      // Check if the viewport height is less than the threshold
      const isTooSmall = viewportHeight < threshold;

      // Update the state based on the condition
      setIsViewportTooSmall(isTooSmall);
    };

    // Add a resize event listener to detect changes in the viewport size
    window.addEventListener('resize', handleResize);

    // Call handleResize once to initialize the state
    handleResize();

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {!isViewportTooSmall && (
        <div className={`${classes.loginFooter}`}>
          <span>{NOT_MEMBER_TEXT}</span>{' '}
          <a href={LEARN_MORE_URL} target="new">
            {LEARN_MORE_TEXT}
          </a>
        </div>
      )}
    </>
  );
};
