import {useEffect, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectLibraryTags, selectUserInfo} from '@/store/selectors';
import {LIBRARY_ITEM_TYPES} from '@/utils/common/constants';

export type TagOptionType = {label: string; value: string};

const useLibraryTags = (type: string) => {
  const api = useAPI();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserInfo())?.id;
  const tags = useSelector(selectLibraryTags(type)) as {
    [id: number | string]: TagOptionType;
  };

  useEffect(() => {
    if (userId && !tags) {
      setLoading(true);
      api(
        type === LIBRARY_ITEM_TYPES.LIBRARY
          ? 'getLibraryTags'
          : 'getHelpCenterTags',
        {}
      )
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [api]);

  return {
    tags,
    loading
  };
};

export default useLibraryTags;
