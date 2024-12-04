import {LibraryList} from './LibraryList';
import {LibraryHeader} from './LibraryHeader';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import useLibrarySearch from './hooks/useLibrarySearch';
import {
  CONST_MARK_REMOVED,
  LIBRARY_ITEM_TYPES,
  ROLES
} from '@/utils/common/constants';
import {LIBRARY_TABS_INFO} from './LibraryHeader/libraryHeader';
import {Spinner} from 'react-bootstrap';
import {NextRouter, useRouter} from 'next/router';
import {ParsedUrlQuery} from 'querystring';
import {useSelector} from 'react-redux';
import {
  selectCacheData,
  selectLibraryItems,
  selectUserInfo
} from '@/store/selectors';
import {Button, ButtonVariants} from '@/ds/Button';
import classes from './libraryPage.module.scss';
import {CacheType} from '@/store/reducers/userSlice';
import useLibraryModal from './hooks/useLibraryModal';

interface LibraryPageProps {
  helpItems: LibraryItem[] | null;
  libraryItems: LibraryItem[] | null;
}

export type LibraryItem = {
  id: number;
  tags?: string[];
  title?: string;
  details?: string;
  subtitle?: string;
  coverImageUrl?: string | undefined;
  coverImage: File | null;
  type?: string;
  order?: number;
  [CONST_MARK_REMOVED]?: boolean;
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const getDefaultFilters = (query: ParsedUrlQuery) => {
  const index = LIBRARY_TABS_INFO.findIndex(
    tabInfo => tabInfo.tabURLName === query.resource
  );
  const categoriesStr = decodeURIComponent((query.categories as string) ?? '');

  return {
    categories: categoriesStr ? categoriesStr.split(',') : [],
    search: query.q as string,
    resource: index > 0 ? index : 0
  };
};

const getSortedList = (items: LibraryItem[] | null) =>
  items?.sort((a, b) => +(b.order ?? 0) - +(a.order ?? 0)) ?? [];

export const updateLibrarySearchParams = (
  router: NextRouter,
  filters: {
    selectedTab?: number;
    searchTerm?: string | null;
    selectedCategories?: string[] | null;
  },
  replace: boolean = false
) => {
  const search: any = filters.searchTerm;
  const prevQuery = {...router.query};
  const categories: any = encodeURIComponent(
    filters.selectedCategories?.join(',') ?? ''
  );
  const resource: any = Number.isInteger(filters.selectedTab)
    ? LIBRARY_TABS_INFO[filters.selectedTab ?? 0]?.tabURLName
    : '';

  if (!replace) {
    filters.searchTerm === null && delete prevQuery.q;
    filters.selectedTab === null && delete prevQuery.resource;
    filters.selectedCategories === null && delete prevQuery.categories;
  }

  router.replace(
    {
      query: {
        ...(!replace && prevQuery),
        ...(search && {q: search}),
        ...(resource && {resource}),
        ...(categories && {categories})
      }
    },
    undefined,
    {shallow: true}
  );
};

export const LibraryPage = ({libraryItems, helpItems}: LibraryPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector(selectUserInfo());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIds, setFilteredIds] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [prevFilters, setPrevFilters] = useState<any>({
    filteredIds: [],
    selectedCategories: [],
    searchTerm: ''
  });
  const itemType =
    selectedTab === 0
      ? LIBRARY_ITEM_TYPES.LIBRARY
      : LIBRARY_ITEM_TYPES.HELP_CENTER;
  const isUserAdmin = userInfo?.role === ROLES.ADMIN;
  const {openModal, modalElement} = useLibraryModal(itemType);
  const {fetchSearchResults, searching} = useLibrarySearch(setFilteredIds);
  const {filteredIds: cachedIds} =
    useSelector(selectCacheData(CacheType.libraryPageHistory)) ?? {};

  const updates = useSelector(selectLibraryItems(itemType));

  useIsomorphicLayoutEffect(() => {
    if (!router.isReady || !userInfo) return;
    const {resource, categories, search} = getDefaultFilters(router.query);
    if (selectedTab !== resource) setSelectedTab(resource);
    if (search && searchTerm !== search) {
      if (!cachedIds) {
        fetchSearchResults(
          search,
          resource === 0
            ? LIBRARY_ITEM_TYPES.LIBRARY
            : LIBRARY_ITEM_TYPES.HELP_CENTER
        ).then(() => {
          setLoading(false);
          setSearchTerm(search);
          setSelectedCategories(categories);
        });
      } else {
        setLoading(false);
        setSearchTerm(search);
        setFilteredIds(cachedIds);
        setSelectedCategories(categories);
      }
      return;
    }
    setSelectedCategories(categories);
    setLoading(false);
  }, [router.isReady, userInfo]);

  const itemsList = useMemo(() => {
    const items =
      (itemType === LIBRARY_ITEM_TYPES.LIBRARY ? libraryItems : helpItems) ??
      [];
    const itemIds = new Set(items.map(i => i.id));

    return getSortedList(
      updates
        ? [
            ...items
              .filter(item => !updates[item.id]?.[CONST_MARK_REMOVED])
              .map(item => ({...item, ...updates?.[item.id]})),
            ...Object.values(updates).filter(
              (item: any) => !item[CONST_MARK_REMOVED] && !itemIds.has(item.id)
            )
          ]
        : items
    );
  }, [updates, itemType, libraryItems, helpItems]);

  const searchedItems = useMemo(() => {
    if (!searchTerm.trim()) return itemsList;
    return itemsList?.filter(item => filteredIds.includes(item.id));
  }, [filteredIds, itemsList]);

  const options = useMemo(() => {
    return [...new Set(searchedItems?.flatMap(li => li.tags ?? []))].sort();
  }, [searchedItems]);

  const categoriesItems = useMemo(() => {
    if (!selectedCategories.length) return searchedItems;
    return searchedItems?.filter(item =>
      item.tags?.some(tag => selectedCategories.includes(tag))
    );
  }, [searchedItems, selectedCategories]);

  const updateSearchTerm = (val: string) => {
    setSearchTerm(val);
    if (!val) {
      if (!searchTerm) return;
      setSelectedCategories([]);
      updateLibrarySearchParams(router, {
        selectedCategories: null,
        searchTerm: null
      });
      return setFilteredIds([]);
    }
    fetchSearchResults(val, itemType).then(() => {
      updateLibrarySearchParams(router, {
        selectedCategories: null,
        searchTerm: val
      });
      setSelectedCategories([]);
    });
  };

  const handleTabChange = (index: number) => {
    if (selectedTab === index) return;
    setSelectedTab(index);
    setSearchTerm(prevFilters.searchTerm);
    setFilteredIds(prevFilters.filteredIds);
    setSelectedCategories(prevFilters.selectedCategories);
    setPrevFilters({
      searchTerm,
      filteredIds,
      selectedCategories
    });
    updateLibrarySearchParams(
      router,
      {
        searchTerm: prevFilters.searchTerm,
        selectedTab: index,
        selectedCategories: prevFilters.selectedCategories
      },
      true
    );
  };

  const handleAddItem = () => {
    openModal();
  };

  if (loading) {
    return <Spinner size="sm" />;
  }

  return (
    <>
      {modalElement}
      <LibraryHeader
        searchTerm={searchTerm}
        isSearching={searching}
        selectedTab={selectedTab}
        categoryOptions={options}
        selectedCategories={selectedCategories}
        handleTabChange={handleTabChange}
        updateSearchTerm={updateSearchTerm}
        setSelectedCategories={setSelectedCategories}
        apiErr={!itemsList}
      />

      {isUserAdmin && (
        <div className={classes.adminOptions}>
          <Button
            variant={ButtonVariants.BluePrimary}
            className={classes.addBtn}
            onClick={handleAddItem}
          >
            ADD ITEM +
          </Button>
        </div>
      )}

      {categoriesItems ? (
        <LibraryList
          itemType={itemType}
          libraryItems={categoriesItems}
          filteredIds={filteredIds}
        />
      ) : (
        <div className="mt-4">
          Error fetching data, Please refresh the page or try again later.
        </div>
      )}
    </>
  );
};
