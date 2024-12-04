import {LibraryModal} from '@/components/Library/LibraryModal/libraryModal';
import {createPortal} from 'react-dom';
import {LibraryItem} from '../libraryPage';
import {useState} from 'react';

const useLibraryModal = (itemType: string, data?: LibraryItem) => {
  const [show, setShow] = useState(false);
  const openModal = () => setShow(true);
  const modalElement = show ? (
    createPortal(
      <LibraryModal
        data={data}
        itemType={itemType}
        handleCloseModal={() => setShow(false)}
      />,
      document.body
    )
  ) : (
    <></>
  );

  return {openModal, modalElement};
};

export default useLibraryModal;
