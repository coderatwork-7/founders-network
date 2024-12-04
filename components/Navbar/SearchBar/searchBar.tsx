import {useCallback, useEffect, useState} from 'react';
import classes from './searchBar.module.scss';
import clsx from 'clsx';
import {SearchTypeahead} from '@/components/SearchTypeahead';
import {useRouter} from 'next/navigation';
import {debounce} from 'throttle-debounce';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import useAPI from '@/utils/common/useAPI';
import {REQUEST_DEBOUNCE_TIME} from '@/utils/common/constants';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
  setShow: (val: boolean) => void;
}

export const SearchBar = ({setShow}: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState(null as any);
  const loading = useSelector(selectApiState('getSearchSuggestions'));

  const api = useAPI();

  const fetchSearchSuggestions = useCallback(
    debounce(REQUEST_DEBOUNCE_TIME, async (searchTerm: string) => {
      let response;
      try {
        response = (await api('getSearchSuggestions', {
          searchTerm: searchTerm,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        })) as any;
        setSuggestions(response.data);
      } catch (err: any) {
        setSuggestions({});
      }
    }),
    [api]
  );

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      fetchSearchSuggestions(searchTerm.trim());
    } else {
      setSuggestions(null);
    }
  }, [searchTerm]);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    router.push(`/search/?q=${searchTerm}`);
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className={classes.searchBar}>
      <div className={classes.iconContainer}>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.icon} />
        )}
      </div>
      <input
        placeholder="Search"
        type="text"
        value={searchTerm}
        className={classes.searchInput}
        onChange={handleChange}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        autoFocus
      />
      <button
        onClick={handleClose}
        type="button"
        className={clsx(['btn-close', classes.close])}
      ></button>
      {!loading && suggestions && (
        <div className={classes.suggestionsContainer}>
          <SearchTypeahead searchResult={suggestions} searchTerm={searchTerm} />
        </div>
      )}
    </div>
  );
};
