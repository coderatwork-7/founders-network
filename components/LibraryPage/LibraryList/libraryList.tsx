import classes from './libraryList.module.scss';
import {LibraryItem} from '../libraryPage';
import {LibraryCard} from '../LibraryCard';
import {cacheData, CacheType} from '@/store/reducers/userSlice';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {useContext} from 'react';
import {
  ModalContext,
  ModalName
} from '@/components/ContextProviders/ModalContext';

interface LibraryListProps {
  libraryItems: LibraryItem[];
  itemType: string;
  filteredIds: number[];
}

export const LibraryList: React.FC<LibraryListProps> = ({
  libraryItems,
  itemType,
  filteredIds
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {openModal} = useContext(ModalContext);

  const handleCardClick = () => {
    dispatch(
      cacheData({
        [CacheType.libraryPageHistory]: {path: router.asPath, filteredIds}
      })
    );
  };

  const handleDeleteLibraryItem = (data: LibraryItem) => {
    openModal(ModalName.DeleteLibraryItem, {data, type: itemType});
  };

  return (
    <>
      {libraryItems?.length ? (
        <div className={classes.list}>
          {libraryItems?.map(item => (
            <LibraryCard
              data={item}
              key={item.id}
              itemType={itemType}
              handleCardClick={handleCardClick}
              deleteLibraryItem={handleDeleteLibraryItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center"> No Results Found</div>
      )}
    </>
  );
};
