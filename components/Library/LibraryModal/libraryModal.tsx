import {TagOptionType} from '@/components/LibraryPage/hooks/useLibraryTags';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import {Button, ButtonVariants} from '@/ds/Button';
import {LIBRARY_ITEM_TYPES} from '@/utils/common/constants';
import useAPI from '@/utils/common/useAPI';
import clsx from 'clsx';
import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import {MultiValue} from 'react-select';
import {LibraryDetailsForm} from '../LibraryDetailsForm/libraryDetailsForm';
import classes from './libraryModal.module.scss';
import {toast} from 'react-toastify';

interface LibraryModalProps {
  data?: LibraryItem;
  itemType: string;
  handleCloseModal: () => void;
}

export type LibraryItemUpdateType = Omit<LibraryItem, 'tags'> & {
  tags: MultiValue<TagOptionType>;
};

export type ValidationObjType = {
  [key in keyof LibraryItemUpdateType]?: boolean;
} & {
  invalidCount: number;
};

export const LibraryModal: React.FC<LibraryModalProps> = ({
  data,
  itemType,
  handleCloseModal
}) => {
  const api = useAPI();
  const isNewPost = !data?.id;
  const [loading, setLoading] = useState(false);

  const label =
    itemType === LIBRARY_ITEM_TYPES.LIBRARY ? 'Library' : 'Help Center';

  const [formData, setFormData] = useState<LibraryItemUpdateType>({
    id: 0,
    tags: [],
    order: 0,
    title: '',
    details: '',
    subtitle: '',
    coverImage: null
  });

  const [validations, setValidations] = useState<ValidationObjType>({
    title: true,
    details: true,
    subtitle: true,
    coverImage: true,
    invalidCount: 0
  });

  const checkFormValidity = () => {
    const invalidCount =
      +(!formData.coverImage && !formData.coverImageUrl) +
      +!formData.title +
      +!formData.subtitle;

    if (!invalidCount) {
      return true;
    }

    setValidations({
      invalidCount,
      title: !!formData.title,
      subtitle: !!formData.subtitle,
      coverImage: !!formData.coverImage || !!formData.coverImageUrl
    });
  };

  const handleSubmit = () => {
    if (checkFormValidity()) {
      const {id, coverImage, title, subtitle, tags, order, details} = formData;
      setLoading(true);
      const data = new FormData();
      data.append('title', title ?? '');
      data.append('details', details ?? '');
      data.append('subtitle', subtitle ?? '');
      coverImage && data.append('coverImageUrl', coverImage ?? '');
      data.append('orderNumber', order?.toString() ?? '');
      data.append('tags', tags.map(t => t.value).join(','));
      id && data.append('id', id.toString());

      api(
        'updateLibraryItem',
        {
          type: itemType,
          id: id || undefined
        },
        {
          method: id ? 'PUT' : 'POST',
          data
        }
      )
        .then(() => {
          setLoading(false);
          handleCloseModal();
          toast.success(`${label} Post ${id ? 'Updated' : 'Created'}`, {
            theme: 'dark'
          });
        })
        .catch(() => {
          setLoading(false);
          toast.error(
            `Error ${id ? 'Updating' : 'Creating'} Post! Please Try Again.`,
            {
              theme: 'dark'
            }
          );
        });
    }
  };

  return (
    <Modal
      centered
      fullscreen
      show={true}
      animation={true}
      enforceFocus={false}
      onHide={handleCloseModal}
      dialogClassName={classes.modal}
      contentClassName={classes.content}
    >
      <Modal.Header closeButton className={classes.modalHeader}>
        <Modal.Title className={clsx([classes.modalTitle, 'text-truncate'])}>
          {isNewPost ? `New ${label} Post` : `Edit ${label} Post`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={classes.modalBody}>
        <LibraryDetailsForm
          data={data}
          formData={formData}
          setFormData={setFormData}
          itemType={itemType}
          validations={validations}
          setValidations={setValidations}
        />
      </Modal.Body>

      <Modal.Footer className={classes.footer}>
        <Button
          textUppercase
          className={classes.btn}
          onClick={handleCloseModal}
          variant={ButtonVariants.Secondary}
        >
          Cancel
        </Button>

        <Button
          textUppercase
          loading={loading}
          onClick={handleSubmit}
          className={classes.btn}
          variant={ButtonVariants.Primary}
          disabled={loading || !!validations.invalidCount}
          loadingChildren={isNewPost ? 'Creating' : 'Updating'}
        >
          {isNewPost ? 'Create' : 'Update'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
