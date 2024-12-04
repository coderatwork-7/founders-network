import React, {
  KeyboardEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';

import CloseIcon from '@mui/icons-material/Close';

import styles from './FnModal.module.scss';
import clsx from 'clsx';
import FnText from '../FnText';

interface IProps extends PropsWithChildren {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  hasCloseButton?: boolean;
  title?: string;
  footerContent?: JSX.Element;
}

export const FnModal: React.FC<IProps> = props => {
  const {
    className,
    footerContent,
    isOpen,
    onClose,
    hasCloseButton = true,
    title,
    children
  } = props;

  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const modalContentClass = clsx(styles.modalContent, className);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef?.current;
    if (modalElement) {
      if (showModal) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [showModal]);

  return (
    <dialog ref={modalRef} className={styles.FnModal} onKeyDown={handleKeyDown}>
      <header>
        <FnText className={styles.title} type="heading-xSmall" bold>
          {title}
        </FnText>
        {hasCloseButton && (
          <button className={styles.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </button>
        )}
      </header>
      <div className={modalContentClass}>{children}</div>
      <footer>{footerContent}</footer>
    </dialog>
  );
};

export default FnModal;
