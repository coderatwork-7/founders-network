import clsx from 'clsx';
import styles from './functionSidebar.module.scss';
import {handleSpecificScroll} from '@/utils/common/helper';
import {useState} from 'react';
import useScrollVisible from '@/hooks/useScrollVisible';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';

const navLinks = [
  {id: 'summary', name: 'Summary', access: 'Everybody'},
  {id: 'details', name: 'Details', access: 'Everybody'},
  {id: 'featured', name: 'Featured', access: 'Everybody'},
  {id: 'attendees', name: 'Attendees', access: 'Everybody'},
  {id: 'tickets', name: 'Tickets', access: 'Everybody'},
  {id: 'rsvps', name: 'RSVPs', access: 'ADMIN'}
];

export const FunctionSidebar = () => {
  const userInfo = useSelector(selectUserInfo());
  const [activeLink, setActiveLink] = useState<string | null>('summary');

  useScrollVisible(
    navLinks.map(ele => ele.id),
    setActiveLink
  );

  return (
    <div className={styles.navbarContainer}>
      <ul className={styles.navbar}>
        {navLinks.map((link: Record<string, any>) => {
          if (userInfo?.role !== ROLES.ADMIN && link.access == 'ADMIN')
            return null;
          return (
            <li
              key={link.id}
              className={clsx(styles.navbarList)}
              onClick={() => handleSpecificScroll({id: link.id})}
            >
              <div
                className={clsx(
                  styles.linkBox,
                  activeLink === link.id ? styles.linkBoxActive : ''
                )}
              >
                <div className={styles.listDot}></div>
                <div
                  className={clsx(
                    styles.content,
                    activeLink === link.id && styles.active
                  )}
                >
                  {link.name}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
