import {NavLink} from '@/components/Navbar/NavLink';
import {usePathname} from 'next/navigation';
import {
  detectActiveMenu,
  getRoleBasedMenu,
  NavItemInterface
} from '@/utils/common/navUtils';
import {NAV_LINKS_DESKTOP, NAV_WITHOUT_LOGIN} from '@/utils/common/constants';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface NavLinksDesktopProps {
  role?: string;
}
export const NavLinksDesktop = ({role}: NavLinksDesktopProps) => {
  const pathname = usePathname();
  const userInfo = useSelector(selectUserInfo());
  let navLinks = getRoleBasedMenu(
    userInfo ? NAV_LINKS_DESKTOP : NAV_WITHOUT_LOGIN,
    role ?? ''
  );

  return (
    <div>
      <ul className="d-flex">
        {navLinks.map((item: NavItemInterface) => {
          return (
            <NavLink
              key={item.label}
              item={item}
              selected={detectActiveMenu(item, pathname)}
              desktop={true}
              className={clsx(item.className)}
              role={role ?? ''}
            />
          );
        })}
      </ul>
    </div>
  );
};
