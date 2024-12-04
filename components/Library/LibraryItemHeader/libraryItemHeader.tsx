import {
  ModalContext,
  ModalName
} from '@/components/ContextProviders/ModalContext';
import useLibraryModal from '@/components/LibraryPage/hooks/useLibraryModal';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import {CacheType} from '@/store/reducers/userSlice';
import {selectCacheData, selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import {
  faArrowLeftLong,
  faPencil,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import classes from './libraryItemHeader.module.scss';

export const LibraryItemHeader: React.FC<{data: LibraryItem; type: string}> = ({
  data,
  type
}) => {
  const router = useRouter();
  const {openModal} = useContext(ModalContext);
  const userInfo = useSelector(selectUserInfo());
  const isUserAdmin = userInfo?.role === ROLES.ADMIN;
  const {openModal: openLibModal, modalElement} = useLibraryModal(type, data);
  const {path: prevUrl} =
    useSelector(selectCacheData(CacheType.libraryPageHistory)) ?? {};

  const handleRedirect = () => {
    prevUrl ? router.back() : router.replace('/library');
  };

  const handleDeleteClick = () => {
    openModal(ModalName.DeleteLibraryItem, {data, type, handleRedirect});
  };

  return (
    <>
      {modalElement}

      <div className={classes.header}>
        <Link href={prevUrl ?? '/library'} className={classes.previousPageLink}>
          <FontAwesomeIcon icon={faArrowLeftLong} />
          <div>Visit Library</div>
        </Link>

        {isUserAdmin && (
          <div className={classes.iconContainer}>
            <button
              className={classes.cardIcon}
              tabIndex={0}
              onClick={handleDeleteClick}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>

            <button
              className={classes.cardIcon}
              tabIndex={0}
              onClick={openLibModal}
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
