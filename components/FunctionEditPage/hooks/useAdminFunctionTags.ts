import {useEffect, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectAdminFunctionTags, selectUserInfo} from '@/store/selectors';
import {GroupBase, OptionsOrGroups} from 'react-select';

type TagsWithLoading = {
  [key: string]: SelectOptionsType;
} & {loading: boolean};

export type SelectOptionsType =
  | OptionsOrGroups<any, GroupBase<any>>
  | undefined;

const useAdminFunctionTags = () => {
  const api = useAPI();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserInfo())?.id;
  const tags = useSelector(selectAdminFunctionTags()) as {
    [key: string]: SelectOptionsType;
  };

  useEffect(() => {
    setLoading(!userId);
    if (userId && !tags) {
      setLoading(true);
      api('getAdminFunctionTags', {})
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [api, userId, tags]);

  return {
    ...tags,
    loading
  } as TagsWithLoading;
};

export default useAdminFunctionTags;
