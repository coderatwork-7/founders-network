import React from 'react';

import styles from './FNTabNavigation.module.scss';
import clsx from 'clsx';
import {Button, ButtonVariants} from '../Button';

export interface INavItem {
  displayName: string | JSX.Element;
  tab: string;
  external?: boolean;
}
interface IProps {
  tabs: INavItem[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const FnTabNavigation: React.FC<IProps> = props => {
  const {activeTab, setActiveTab, tabs} = props;

  return (
    <div className={styles.FNTabNavigation}>
      <ul>
        {tabs.map(item => {
          const itemClass = clsx(styles.item, {
            [styles.activeTab]: item.tab === activeTab && !item.external
          });

          const handleClick = () => {
            setActiveTab(item.tab);
          };

          return (
            <li className={itemClass} key={item.tab}>
              <Button variant={ButtonVariants.TEXT_ONLY} onClick={handleClick}>
                {item.displayName}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FnTabNavigation;
