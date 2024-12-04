import {useState} from 'react';
import clsx from 'clsx';
import {NavLink} from '@/components/Navbar/NavLink';
import classes from './navLinksMobile.module.scss';
import {CloseIcon, MenuIcon} from '@/ds/Icons';
import {NAV_LINKS_MOBILE, NAV_WITHOUT_LOGIN} from '@/utils/common/constants';
import {detectActiveMenu, getRoleBasedMenu} from '@/utils/common/navUtils';
import {usePathname} from 'next/navigation';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface NavLinksMobileProps {
  role?: string;
}

export const NavLinksMobile = ({role}: NavLinksMobileProps) => {
  const pathname = usePathname();
  const userInfo = useSelector(selectUserInfo());
  const [expanded, setExpanded] = useState(false);
  let navLinks = getRoleBasedMenu(
    userInfo ? NAV_LINKS_MOBILE : NAV_WITHOUT_LOGIN,
    role ?? ''
  );

  return (
    <>
      <div
        className={clsx([classes.icon, expanded && classes.closeIcon])}
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? <CloseIcon /> : <MenuIcon />}
      </div>
      <div
        className={classes.menuLinks + (expanded ? ` ${classes.expanded}` : '')}
      >
        <ul onClick={() => setExpanded(false)}>
          {navLinks.map(item => (
            <NavLink
              key={item.label}
              item={item}
              selected={detectActiveMenu(item, pathname)}
              className={item.className}
              role={role ?? ''}
            />
          ))}
        </ul>
      </div>
    </>
  );
};
