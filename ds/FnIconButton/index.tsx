import React from 'react';

import styles from './FnIconButton.module.scss';

interface IProps {
  icon: JSX.Element;
  onClick: () => void;
}

export const FnIconButton: React.FC<IProps> = props => {
  const {icon, onClick} = props;

  return (
    <button onClick={onClick} className={styles.FnIconButton}>
      {icon}
    </button>
  );
};

export default FnIconButton;
