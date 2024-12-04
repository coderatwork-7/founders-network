import React from 'react';

import styles from './LoginLoginTab.module.scss';
import PasswordFormItem from '../FormItem/PasswordFormItem';

interface IProps {}

export const LoginLoginTab: React.FC<IProps> = props => {
  const {} = props;

  return (
    <div className={styles.LoginLoginTab}>
      <PasswordFormItem name="password" title="Password" endpoint={'general'} />
    </div>
  );
};

export default LoginLoginTab;
