import React from 'react';
import Head from 'next/head';
import {DatePicker} from '@/components/DatePicker';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import useIsMobile from '@/utils/common/useIsMobile';
import {FunctionPageFacetsProvider} from '@/components/ContextProviders/FunctionPageFacetsContext';
import FunctionDashboard from '@/components/Function';
import useAuth from '@/hooks/useAuth';
import {selectUserInfo} from '@/store/selectors';
import {PAGES, ROLES} from '@/utils/common/constants';
import {useSelector} from 'react-redux';
import {Button, ButtonVariants} from '@/ds/Button';
import Link from 'next/link';

export default function Functions(): JSX.Element {
  useAuth();
  const isMobile = useIsMobile();
  const isUserAdmin = useSelector(selectUserInfo())?.role === ROLES.ADMIN;

  return (
    <>
      <Head>
        <title>Functions | Founders Network</title>
      </Head>
      <main className={`pageLayout`}>
        <FunctionPageFacetsProvider>
          <div
            className={`leftContainer ${
              !isMobile ? 'leftContainerFixedPostion' : ''
            } globalDatePicker`}
          >
            {isUserAdmin && (
              <Link href={PAGES.FUNCTIONS_ADD} className="w-100">
                <Button variant={ButtonVariants.Primary} className="w-100">
                  ADD FUNCTION
                </Button>
              </Link>
            )}
            {!isMobile && <NominationWidget />}
            <DatePicker />
          </div>
          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            {FunctionDashboard}
          </div>
        </FunctionPageFacetsProvider>
      </main>
    </>
  );
}
