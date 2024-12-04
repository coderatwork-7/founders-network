import React from 'react';

import styles from './InputErrorMessage.module.scss';

interface IProps {
  message: string;
}

export const InputErrorMessage: React.FC<IProps> = props => {
  const {message} = props;

  return <p className={styles.InputErrorMessage}>{message}</p>;
};

export default InputErrorMessage;
