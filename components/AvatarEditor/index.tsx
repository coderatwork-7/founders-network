import React, {MouseEvent, useRef, useState} from 'react';

import Image from 'next/image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import styles from './AvatarEditor.module.scss';

import FnText from '@/ds/FnText';
import AvatarEditorModal from './AvatarEditorModal';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';

import {
  useGeneralQuery,
  useCompanyQuery
} from '@/genericApi/foundersNetwork/queries';

interface IProps {
  imageUrl?: string;
  type: 'profileAvatar' | 'companyAvatar';
}

export const AvatarEditor: React.FC<IProps> = props => {
  const {imageUrl, type = 'profileAvatar'} = props;

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {data: generalData} = useGeneralQuery();

  const {data: companyData} = useCompanyQuery();

  const initials =
    type === 'companyAvatar'
      ? companyData?.companyName[0]
      : `${generalData?.firstName[0]}${generalData?.lastName[0]}`;

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const fallback = '';

  const handleChange = () => {
    if (inputRef?.current?.files?.[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setPreviewImage(e.target?.result);
      };

      reader.readAsDataURL(inputRef?.current?.files?.[0]);
    }
    setShowModal(true);
  };

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const mutation = useGetMutationFunction(
    type === 'companyAvatar' ? 'companyLogo' : 'profileImage'
  );

  const onSubmit = async () => {
    setSubmitting(true);
    if (inputRef?.current?.files?.[0]) {
      const formData = new FormData();
      formData.append(
        type === 'profileAvatar' ? 'profileImageUrl' : 'companyImageUrl',
        inputRef?.current?.files?.[0]
      );
      try {
        mutation.mutate(formData, {
          onSuccess: handleCloseModal,
          onSettled: () => setSubmitting(false)
        });
      } catch (error) {
        console.warn(error);
      }
    }
  };

  return (
    <div className={styles.AvatarEditor}>
      <div className={styles.imagePreviewContainer}>
        {imageUrl ? (
          <Image
            alt="User profile image"
            src={imageUrl ?? fallback}
            height={180}
            width={180}
            className={styles.imagePreview}
          />
        ) : (
          <div className={styles.fallback}>
            <FnText bold>{initials}</FnText>
          </div>
        )}
        <button onClick={handleEditClick} className={styles.editButton}>
          <PhotoCameraIcon />
          <FnText>Edit</FnText>
        </button>
      </div>

      <input ref={inputRef} hidden onChange={handleChange} type="file" />
      {previewImage && (
        <AvatarEditorModal
          imageUrl={previewImage as string}
          hasCloseButton
          showModal={showModal}
          onClose={handleCloseModal}
          handleEdit={handleEditClick}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default AvatarEditor;
