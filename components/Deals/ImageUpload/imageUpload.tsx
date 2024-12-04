import React, {useState, ChangeEvent} from 'react';
import styles from './imageUpload.module.scss';
import Image from 'next/image';

interface ImageUploadPropTypes {
  setFiles: any;
}

const ImageUpload: React.FC<ImageUploadPropTypes> = ({setFiles}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
      } else if (!file.type.startsWith('image/')) {
        setError('File must be an image.');
      } else {
        setError(null);
        setFiles(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCancel = () => {
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="imageUploadContainer">
      {imagePreview && (
        <div className={styles['imagePreviewContainer']}>
          <Image
            src={imagePreview}
            alt="Company Logo"
            className={styles['imagePreview']}
            width={250}
            height={200}
          />
          <button className={styles['cancelButton']} onClick={handleCancel}>
            X
          </button>
        </div>
      )}

      {!imagePreview && (
        <input
          type="file"
          className={styles['imageInput']}
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload;
