import {SetStateAction, useCallback} from 'react';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';
import {CanceledError} from 'axios';

const useLibrarySearch = (
  setFilteredIds: React.Dispatch<SetStateAction<number[]>>
) => {
  const api = useAPI();
  const searching = useSelector(selectApiState('getSearchLibrary'));

  const fetchSearchResults = useCallback(
    (searchTerm: string, type: string) =>
      api('getSearchLibrary', {
        q: searchTerm,
        type,
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      })
        .then(res => setFilteredIds(res.data))
        .catch(err => {
          setFilteredIds([]);
          if (err.errorObj instanceof CanceledError) {
            throw err;
          }
        }),
    [api]
  );

  return {
    fetchSearchResults,
    searching
  };
};

export default useLibrarySearch;
