import {NAVLINKS, ROLES} from '@/utils/common/constants';

export interface NavItemInterface {
  label: string;
  href?: string;
  className?: string;
  external?: boolean;
  subMenu?: Array<NavItemInterface>;
}
export const roleAccess = {
  [ROLES.INVESTOR]: {
    all: false,
    submenu: true,
    [NAVLINKS.functions.label]: true,
    [NAVLINKS.nominate.label]: true,
    [NAVLINKS.foundersEdge.label]: true,
    [NAVLINKS.members.label]: true,
    [NAVLINKS.investors.label]: true,
    [NAVLINKS.library.label]: true,
    [NAVLINKS.contactUs.label]: true
  },
  [ROLES.PARTNER_LIMITED]: {
    all: true,
    [NAVLINKS.forum.label]: false,
    [NAVLINKS.functions.label]: false
  },
  [ROLES.GUEST]: {
    all: false,
    [NAVLINKS.functions.label]: true
  }
};

const isMenuEnabled = (role: string, menu: string) => {
  return roleAccess[role]?.[menu] ?? roleAccess[role]?.all ?? true;
};

export const getRoleBasedMenu = (
  linksList: Array<NavItemInterface>,
  role: string
): Array<NavItemInterface> => {
  return linksList.map(link => {
    if (link.subMenu) {
      return {
        ...link,
        subMenu: getRoleBasedMenu(link.subMenu, role),
        className: isMenuEnabled(role ?? '', 'submenu') ? '' : 'navLinkDisabled'
      };
    }

    if (!isMenuEnabled(role ?? '', link.label)) {
      return {
        ...link,
        href: '',
        className: 'navLinkDisabled'
      };
    }
    return link;
  });
};

export const detectActiveMenu = (item: NavItemInterface, pathname: string) => {
  if (pathname === '/') return undefined;
  const list = item.subMenu || [{href: item.href, label: item.label}];
  return list.find(item => item.href?.includes(pathname))?.label;
};
