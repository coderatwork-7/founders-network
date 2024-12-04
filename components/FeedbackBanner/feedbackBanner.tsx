import React, {useContext} from 'react';
import classes from './feedbackStyles.module.scss';
import {ModalContext, ModalName} from '../ContextProviders/ModalContext';
import {usePathname} from 'next/navigation';
import {ADMIN_PATH} from '@/utils/common/constants';

export const FeedbackBanner: React.FC = () => {
  const {openModal} = useContext(ModalContext);
  const pathName = usePathname();
  const handleClick = () => {
    openModal(ModalName.Feedback);
  };

  if (pathName?.includes(`/${ADMIN_PATH}`)) return <></>;
  return (
    // <button className={classes.banner} onClick={handleClick}>
    //   Feedback
    // </button>
    <></>
  );
};
