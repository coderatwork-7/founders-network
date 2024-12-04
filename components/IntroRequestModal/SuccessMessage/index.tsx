import React from 'react';

import styles from './SuccessMessage.module.scss';
import FnText from '@/ds/FnText';

interface IProps {
  investorName: string;
}

export const SuccessMessage: React.FC<IProps> = props => {
  const {investorName} = props;

  return (
    <div className={styles.SuccessMessage}>
      <FnText>{`Great! We sent a message to our member success department letting them know you would like to be connected to ${investorName}. We will be in touch soon!`}</FnText>
    </div>
  );
};

export default SuccessMessage;
