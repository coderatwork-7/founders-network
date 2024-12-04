import React, {PropsWithChildren} from 'react';

import styles from './FnDescriptionList.module.scss';

interface IProps extends PropsWithChildren {}

export const FnDescriptionList: React.FC<IProps> = props => {
  const {children} = props;

  return <dl className={styles.FnDescriptionList}>{children}</dl>;
};

export default FnDescriptionList;
