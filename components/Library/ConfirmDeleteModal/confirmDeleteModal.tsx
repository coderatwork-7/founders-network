import React, {useState} from 'react';
import classes from './confirmDeleteModal.module.scss';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import {toast} from 'react-toastify';
import useAPI from '@/utils/common/useAPI';

export interface ConfirmDeleteModalProps {
  type: string;
  data: LibraryItem;
  handleRedirect?: () => void;
  handleCloseModal: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  data,
  type,
  handleRedirect,
  handleCloseModal
}) => {
  const api = useAPI();
  const {id, title} = data;
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    api('deleteLibraryItem', {type, id}, {method: 'DELETE'})
      .then(() => {
        setLoading(false);
        handleCloseModal();
        handleRedirect?.();
        toast.success('Post Deleted.', {theme: 'dark'});
      })
      .catch(() => {
        setLoading(false);
        handleCloseModal();
        toast.error('Error Deleting Post! Please Try Again.', {theme: 'dark'});
      });
  };

  return (
    <Modal
      centered
      show={true}
      animation={true}
      onHide={handleCloseModal}
      dialogClassName={classes.modal}
      contentClassName={classes.content}
    >
      <Modal.Header closeButton className="pt-3 pb-2 border-0">
        <Modal.Title className={clsx([classes.modalTitle, 'text-truncate'])}>
          Confirm Delete?
        </Modal.Title>
      </Modal.Header>

      <div className="fs-6 text-center px-4 mt-1 mb-3">
        <div>Are you certain you wish to Delete Post -</div>
        <div className="fw-bold">{title}</div>
      </div>

      <div className={classes.btnConatiner}>
        <Button
          textUppercase
          className={classes.btn}
          onClick={handleCloseModal}
          variant={ButtonVariants.Secondary}
        >
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          <span>Cancel</span>
        </Button>

        <Button
          textUppercase
          loading={loading}
          onClick={handleDelete}
          className={classes.btn}
          loadingChildren="Deleting"
          variant={ButtonVariants.Primary}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          <span>Delete</span>
        </Button>
      </div>
    </Modal>
  );
};
