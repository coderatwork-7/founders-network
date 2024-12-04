import clsx from 'clsx';
import classes from './functionEditforms.module.scss';
import {ImageUpload} from '@/ds/ImageUpload';

interface VenuePhotosProps {
  data: string[];
  handleFileUpload: (file: Blob) => Promise<any>;
  setData: React.Dispatch<React.SetStateAction<string[]>>;
}

export const VenuePhotos: React.FC<VenuePhotosProps> = ({
  data,
  setData,
  handleFileUpload
}) => {
  const handleAddPhoto = (url: string) => {
    setData(prev => [...prev, url]);
  };

  const handleRemovePhoto = (url: string) => {
    setData(prev => prev.filter(prevUrl => prevUrl !== url));
  };

  return (
    <div className={classes.form}>
      <div className={classes.field}>
        <div className={clsx(classes.label, 'mb-3')}>Photos</div>

        <div className={classes.headerImage}>
          <ImageUpload
            multiple
            value={data}
            onUpload={handleAddPhoto}
            onDelete={handleRemovePhoto}
            uploadFn={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};
