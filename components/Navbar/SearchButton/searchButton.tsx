import React, {useEffect, useState} from 'react';
import classes from './searchButton.module.scss';
import {SearchBar} from '@/components/Navbar/SearchBar';
import clsx from 'clsx';
import {usePathname, useSearchParams} from 'next/navigation';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

export const SearchButton = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const currentPage = usePathname();
  const query = useSearchParams();

  useEffect(() => {
    setSearchOpen(false);
  }, [currentPage, query]);

  return (
    <div className={classes.searchBox}>
      <button
        className={classes.searchIconContainer}
        onClick={() => setSearchOpen(true)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.icon} />
      </button>
      {searchOpen && (
        <>
          <SearchBar setShow={setSearchOpen} />
          <div
            className={clsx([classes.backdrop, 'offcanvas-backdrop', 'show'])}
            onClick={() => setSearchOpen(false)}
          />
        </>
      )}
    </div>
  );
};
