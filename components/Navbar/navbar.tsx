import Image from 'next/image';
import Link from 'next/link';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import classes from './navbar.module.scss';
import {SearchButton} from './SearchButton';
import {NavLinksMobile} from './NavLinksMobile';
import {NavLinksDesktop} from './NavLinksDesktop';
import {UserUpdates} from './UserUpdates';
import {UserMenu} from '@/components/Navbar/UserMenu';
import {OnboardingAgenda} from '../Onboarding/Agenda';
import {ROLES} from '@/utils/common/constants';
import {useSession} from 'next-auth/react';

export const Navbar = () => {
  const {data: session} = useSession();

  const userInfo = session?.user;

  const breakpoint = useBreakpoint();
  const isLogout: boolean = userInfo ? false : true;
  return (
    <div className={classes.navbarContainer}>
      <nav className={classes.navbar}>
        <div className={classes.menu}>
          <div className={classes.logoContainer}>
            <Link
              href={userInfo?.role === ROLES.INVESTOR ? '/investor' : '/home'}
            >
              <Image
                src={
                  [Breakpoint.mobile, Breakpoint.tablet].includes(breakpoint)
                    ? '/images/logo_key.png'
                    : '/images/FN_LOGO_final.svg'
                }
                alt="logo"
                width={45}
                height={43}
                className={classes.logo}
              />
            </Link>
          </div>
          <div className={classes.navigate}>
            {breakpoint === Breakpoint.mobile ? (
              <NavLinksMobile role={userInfo?.role} />
            ) : (
              <NavLinksDesktop role={userInfo?.role} />
            )}
            {!isLogout && <SearchButton />}
          </div>
          {!isLogout && (
            <>
              <UserUpdates />
              <UserMenu user={userInfo} />
            </>
          )}
        </div>
        <OnboardingAgenda />
      </nav>
    </div>
  );
};
