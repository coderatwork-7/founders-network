import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import classes from './userSearch.module.scss';
import clsx from 'clsx';
import {ChatContext, ConversationType} from '@/components/Chat';
import {debounce} from 'throttle-debounce';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import useAPI from '@/utils/common/useAPI';
import {REQUEST_DEBOUNCE_TIME} from '@/utils/common/constants';
import {CanceledError} from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faXmark} from '@fortawesome/free-solid-svg-icons';

interface UserSearchProps {
  className?: string;
  [key: string]: any;
  asPopup?: boolean;
  closeSearch?: () => void;
  setUserSearchList?: any;
  setIsSearchInProgress?: any;
}

function searchListSorter(
  a: ConversationType,
  b: ConversationType,
  searchTerm: string
): number {
  return (
    +b.name!.toLowerCase().includes(searchTerm) -
      +a.name!.toLowerCase().includes(searchTerm) ||
    +!!b.profileImage - +!!a.profileImage ||
    +!!b.companyName - +!!a.companyName ||
    0
  );
}

export const UserSearch: React.FC<UserSearchProps> = ({
  className,
  asPopup,
  closeSearch,
  ...props
}) => {
  let {setUserSearchList, setIsSearchInProgress} = useContext(ChatContext);
  if (asPopup) ({setUserSearchList, setIsSearchInProgress} = props);
  const [searchTerm, setSearchTerm] = useState('');
  const searching = useRef<boolean>(false);
  const api = useAPI();

  const setSearching = (val: boolean) => {
    searching.current = val;
    setIsSearchInProgress(val);
  };

  const fetchSearchSuggestions = useCallback(
    debounce(REQUEST_DEBOUNCE_TIME, async (searchTerm: string) => {
      let response;
      try {
        response = (await api('getMembers', {
          searchTerm: searchTerm,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        })) as any;
        if (searching.current)
          setUserSearchList(
            response.data.users
              .slice(0, 15)
              .sort((a: any, b: any) => searchListSorter(a, b, searchTerm))
          );
        else setUserSearchList(null);
        setSearching(false);
      } catch (err: any) {
        setUserSearchList([]);
        if (!(err.errorObj instanceof CanceledError)) {
          setSearching(false);
        }
      }
    }),
    [api]
  );

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      setSearching(true);
      fetchSearchSuggestions(searchTerm.trim());
    } else {
      setSearching(false);
      setUserSearchList(null);
    }
  }, [searchTerm]);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      {...props}
      className={clsx([
        classes.searchBox,
        className,
        asPopup && classes.asPopup
      ])}
    >
      {asPopup && (
        <button className={classes.btn}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      )}

      <input
        type="text"
        placeholder="Search User"
        value={searchTerm}
        onChange={handleChange}
        autoFocus
      />

      {asPopup && (
        <button
          className={clsx(classes.btn, classes.close)}
          onClick={() => setSearchTerm('')}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
};
