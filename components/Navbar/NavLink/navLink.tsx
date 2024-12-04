import Link from 'next/link';
import classes from './navLink.module.scss';
import {clsx} from 'clsx';
import {NavItemInterface} from '@/utils/common/navUtils';
import {Popover} from '@/ds/Popover';
import {NAVLINKS, ROLES} from '@/utils/common/constants';
import {MessageUs} from '@/components/MessageUs';

interface NavLinkProps {
  item: NavItemInterface;
  selected?: string;
  desktop?: boolean;
  className?: string;
  role: string;
}

const navMap = {
  [NAVLINKS.contactUs.label]: <MessageUs />
};

const LinkWrapper = ({
  href,
  label,
  className,
  external,
  role
}: NavItemInterface & {role: string}) => {
  if (!href)
    return (
      navMap[role !== ROLES.INVESTOR ? label : '_no_key_'] ?? (
        <span className={className}>{label}</span>
      )
    );

  return external ? (
    <a href={href} target="_blank">
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
};

export const NavLink = ({
  item,
  selected,
  desktop,
  className,
  role
}: NavLinkProps) => {
  let subMenu;
  if (item.subMenu) {
    subMenu = (
      <div className={clsx(classes.dropdownMenu, className)}>
        {item.subMenu.map((item: NavItemInterface) => {
          let isActive = item.label === selected;
          return (
            <LinkWrapper
              key={item.label}
              href={item.href}
              className={clsx([
                isActive && classes.selectedSubMenu,
                item.className
              ])}
              label={item.label}
              external={item.external}
              role={role}
            />
          );
        })}
      </div>
    );
  }
  return item.subMenu ? (
    <Popover
      popover={subMenu}
      showDropdown
      mode="hover"
      popoverClass={classes.popover}
      closeOnClick
      fixedPosition
      offset={[0, -6]}
    >
      <li
        className={clsx(
          [
            desktop ? classes.desktop : classes.mobile,
            classes.dropdown,
            selected && classes.selected
          ],
          className
        )}
      >
        <span>{item.label}</span>
      </li>
    </Popover>
  ) : (
    <li
      className={clsx(
        [
          desktop ? classes.desktop : classes.mobile,
          selected && classes.selected
        ],
        className
      )}
    >
      <LinkWrapper
        href={item.href}
        className={clsx([selected && classes.selected])}
        label={item.label}
        external={item.external}
        role={role}
      />
    </li>
  );
};
