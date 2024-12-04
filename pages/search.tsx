import React, {useState} from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import useAuth from '@/hooks/useAuth';
import {SearchPage} from '@/components/SearchPage';
import {SearchGroupSelectionWidget} from '@/components/SearchPage/Components/SearchGroupSelectionWidget/searchGroupSelectionWidget';

export default function Home(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const [searchGroups, setSearchGroups] = useState<string[]>([]);
  const [activeSearchGroup, setActiveSearchGroup] = useState<string>('');
  useAuth();

  return (
    <>
      <Head>
        <title>Search | Founders Network</title>
      </Head>

      <main className={`${styles.main} pageLayout`}>
        <div
          className={`leftContainer ${
            !isMobile ? 'leftContainerFixedPostion' : ''
          }`}
        >
          {!isMobile && (
            <>
              <SearchGroupSelectionWidget
                searchGroups={searchGroups}
                activeSearchGroup={activeSearchGroup}
                setActiveSearchGroup={setActiveSearchGroup}
              />
              <NominationWidget />
            </>
          )}
        </div>
        <div
          className={`rightContainer ${
            !isMobile ? 'rightContainerFixedPostion' : ''
          }`}
        >
          <SearchPage
            setSearchGroups={setSearchGroups}
            setActiveSearchGroup={setActiveSearchGroup}
          />
        </div>
      </main>
    </>
  );
}
