import Image from 'next/image';
import classes from './libraryCard.module.scss';
import {LibraryItem} from '../libraryPage';
import {useState} from 'react';
import {Tag} from '@/ds/Tag';
import Link from 'next/link';
import {LIBRARY_ITEM_TYPES, ROLES} from '@/utils/common/constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import useLibraryModal from '../hooks/useLibraryModal';
import {selectUserInfo} from '@/store/selectors';
import {useSelector} from 'react-redux';

interface LibraryCardProps {
  data: LibraryItem;
  itemType: string;
  handleCardClick: () => void;
  deleteLibraryItem: (data: LibraryItem) => void;
}

export const LibraryCard = ({
  data,
  itemType,
  handleCardClick,
  deleteLibraryItem
}: LibraryCardProps) => {
  const [showCoverImage, setShowCoverImage] = useState(true);
  const {openModal, modalElement} = useLibraryModal(itemType, data);
  const isUserAdmin = useSelector(selectUserInfo())?.role === ROLES.ADMIN;

  const handleDeleteClick = () => {
    deleteLibraryItem(data);
  };

  const urlType =
    itemType === LIBRARY_ITEM_TYPES.LIBRARY ? 'library' : 'help-center';

  return (
    <>
      {modalElement}
      <div className={classes.cardContainer}>
        <Link
          href={`/${urlType}/${data.id}`}
          className={classes.card}
          onClick={handleCardClick}
          tabIndex={0}
        >
          <div className={classes.coverContainer}>
            {showCoverImage && data?.coverImageUrl && (
              <Image
                alt="Collection Image"
                src={data.coverImageUrl}
                fill
                className={classes.coverImg}
                onError={() => setShowCoverImage(false)}
              />
            )}
          </div>
          <div className={classes.cardContent}>
            <div className={classes.content}>
              <h5>{data.title}</h5>
              <div className={classes.subtitle}>{data.subtitle}</div>
            </div>
            {!!data.tags?.length && (
              <div className={classes.tags}>
                {data.tags.map(tag => (
                  <Tag key={tag} defaultSelected>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </Link>
        {isUserAdmin && (
          <div className={classes.iconContainer}>
            <button
              tabIndex={0}
              onClick={handleDeleteClick}
              className={classes.cardIcon}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>

            <button
              tabIndex={0}
              onClick={openModal}
              className={classes.cardIcon}
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
