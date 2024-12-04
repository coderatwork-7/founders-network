import Image from 'next/image';
import React from 'react';
import styles from './imageUpload.module.scss';

interface ImageUploadPropType {
  previewImage: File | null | undefined | string;
  setPreviewImage: any;
}

export const ImageUpload: React.FC<ImageUploadPropType> = ({
  previewImage,
  setPreviewImage
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreviewImage(file);
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
  };

  return (
    <div>
      {previewImage ? (
        <div>
          <Image
            src={
              typeof previewImage == 'string'
                ? previewImage
                : URL.createObjectURL(previewImage)
            }
            alt="Preview Image"
            width={100}
            height={100}
            className={styles.imageStyles}
          />
          <div className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </div>
        </div>
      ) : (
        <input type="file" accept="image/*" onChange={handleImageChange} />
      )}
    </div>
  );
};
