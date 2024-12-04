import React, {MouseEvent, useMemo, useRef, useState} from 'react';
import Image from 'next/image';

import styles from './AvatarEditorModal.module.scss';

import FnText from '@/ds/FnText';
import FnModal from '@/ds/FnModal';
import {Button, ButtonVariants} from '@/ds/Button';

interface IProps {
  showModal: boolean;
  onClose: () => void;
  hasCloseButton?: boolean;
  imageUrl: string;
  handleEdit?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export const AvatarEditorModal: React.FC<IProps> = props => {
  const {
    hasCloseButton,
    imageUrl,
    onClose,
    showModal,
    handleEdit,
    onSubmit,
    submitting
  } = props;

  const Footer = (
    <div className={styles.footer}>
      <Button
        variant={ButtonVariants.TEXT_ONLY}
        className={styles.saveButton}
        onClick={handleEdit}
        disabled={submitting}
      >
        Edit photo
      </Button>
      <Button
        disabled={submitting}
        loading={submitting}
        onClick={onSubmit}
        className={styles.saveButton}
      >
        SAVE
      </Button>
    </div>
  );

  return (
    <FnModal
      hasCloseButton={hasCloseButton}
      isOpen={showModal}
      className={styles.AvatarEditorModal}
      onClose={onClose}
      title="Preview"
      footerContent={Footer}
    >
      <Image
        alt="User profile image"
        src={imageUrl}
        height={180}
        width={180}
        className={styles.imagePreview}
      />
      <FnText bold>Photo Preview</FnText>
    </FnModal>
  );
};

export default AvatarEditorModal;
