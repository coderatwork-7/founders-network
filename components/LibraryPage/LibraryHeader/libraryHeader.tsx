import classes from './libraryHeader.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass, faXmark} from '@fortawesome/free-solid-svg-icons';
import {Tabs} from '@/ds/Tabs';
import {
  ChangeEvent,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import clsx from 'clsx';
import {Spinner} from '@/ds/Spinner';
import {useRouter} from 'next/router';
import {updateLibrarySearchParams} from '../libraryPage';

export enum LIBRARY_TABS {
  fnLibrary,
  helpCenter
}

export const LIBRARY_TABS_INFO = [
  {
    name: LIBRARY_TABS.fnLibrary,
    label: 'fnLibrary',
    description:
      'Collections of influential posts from the Network, curated by the staff.',
    searchPlaceholder: 'Search the Library...',
    tabURLName: 'fnLibrary'
  },
  {
    name: LIBRARY_TABS.helpCenter,
    label: 'Help Center',
    description:
      'Search here for posting guidelines, troubleshooting, and how to utilize each feature that FN offers.',
    searchPlaceholder: 'Search in Help Center...',
    tabURLName: 'help-center'
  }
];

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface LibraryHeaderProps {
  selectedTab: number;
  handleTabChange: (index: number) => void;
  categoryOptions: string[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<SetStateAction<string[]>>;
  searchTerm: string;
  updateSearchTerm: (val: string) => void;
  isSearching: boolean;
  apiErr: boolean;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  selectedTab,
  handleTabChange,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  searchTerm,
  updateSearchTerm,
  isSearching,
  apiErr
}) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm, selectedTab]);

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchTerm && !e.target.value.trim()) updateSearchTerm('');
  };

  const handleSearchKeyUp: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      updateSearchTerm(searchValue.trim());
    }
  };

  const handleCloseSearch = () => {
    setSearchValue('');
    updateSearchTerm('');
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    updateLibrarySearchParams(router, {selectedCategories});
  };

  return (
    <div className={classes.libHeader}>
      <div className={classes.headingTabs}>
        <Tabs
          key={selectedTab}
          tabClass="h-auto"
          containerClass="h-auto"
          selectedIndex={selectedTab}
          labels={LIBRARY_TABS_INFO.map(tab => tab.label)}
          setSelected={handleTabChange}
        />
      </div>

      {!apiErr && (
        <>
          <div className={classes.description}>
            {LIBRARY_TABS_INFO[selectedTab].description}
          </div>
          <div className={classes.searchContainer}>
            <div className={classes.searchBar}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                value={searchValue}
                className={classes.input}
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchValueChange}
                placeholder={LIBRARY_TABS_INFO[selectedTab].searchPlaceholder}
              />
              {isSearching ? (
                <Spinner size="sm" />
              ) : (
                !!searchValue.length && (
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={handleCloseSearch}
                    className={classes.iconClose}
                  />
                )
              )}
            </div>

            <SelectMenu
              options={categoryOptions}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

const SelectMenu: React.FC<{
  options: string[];
  selectedCategories: LibraryHeaderProps['selectedCategories'];
  setSelectedCategories: LibraryHeaderProps['setSelectedCategories'];
  handleCategoryChange: (categories: string[]) => void;
}> = ({
  options,
  selectedCategories,
  setSelectedCategories,
  handleCategoryChange
}) => {
  const [show, setShow] = useState(false);
  const selectionCount = selectedCategories.length;

  const handleMenuSelect =
    (menuName: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedCategories(prev => {
        const menuItems = [...prev];
        e.target.checked
          ? menuItems.push(menuName)
          : menuItems.splice(menuItems.indexOf(menuName), 1);
        handleCategoryChange(menuItems);
        return menuItems;
      });
    };

  return (
    <div className={clsx(classes.filterDropdown, show && classes.show)}>
      <button
        className={classes.dropdown}
        onBlur={() => setShow(false)}
        onClick={() => setShow(v => !v)}
      >
        {'Categories' + (selectionCount ? ` - (${selectionCount})` : '...')}
      </button>
      <div className={classes.menuContainer}>
        <div className={classes.menu}>
          {options.length ? (
            options.map(item => (
              <label htmlFor={item} key={item} className={classes.menuItem}>
                <input
                  id={item}
                  type="checkbox"
                  checked={selectedCategories.includes(item)}
                  onChange={handleMenuSelect(item)}
                />
                <div>{item}</div>
              </label>
            ))
          ) : (
            <div className={clsx(classes.menuItem, classes.disabled)}>
              No options available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
