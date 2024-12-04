import React from 'react';
import Link from 'next/link';
import classes from './searchTypeahead.module.scss';
import {SearchGroup} from './SearchGroup';

interface SearchTypeaheadProps {
  searchResult: any;
  searchTerm: string;
}

export function SearchTypeahead({
  searchResult,
  searchTerm
}: SearchTypeaheadProps): JSX.Element {
  return (
    <div className={classes.container}>
      {Object.keys(searchResult).map((group: any) => (
        <React.Fragment key={group}>
          {Array.isArray(searchResult[group]) &&
            !!searchResult[group].length && (
              <SearchGroup
                key={group}
                items={searchResult[group]}
                type={group}
                searchTerm={searchTerm}
              />
            )}
        </React.Fragment>
      ))}
      {Object.keys(searchResult).filter(
        (group: any) => searchResult[group].length
      ).length ? (
        <Link href={`/search/?q=${searchTerm}`} className={classes.searchLink}>
          {`See all results for "${searchTerm}"`}
        </Link>
      ) : (
        <div className="text-center">No results found.</div>
      )}
    </div>
  );
}
