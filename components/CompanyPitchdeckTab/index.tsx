import React, {MouseEvent, useRef, useState} from 'react';
import Image from 'next/image';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import styles from './CompanyPitchdeckTab.module.scss';
import {useCompanyQuery} from '@/genericApi/foundersNetwork/queries';
import {Button} from '@/ds/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {usePitchdeckMutation} from '@/genericApi/foundersNetwork/mutations';
import {Spinner} from '@/ds/Spinner';

interface IProps {}

export const CompanyPitchdeckTab: React.FC<IProps> = props => {
  const {} = props;

  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const {data, isLoading} = useCompanyQuery();
  const mutation = usePitchdeckMutation();

  const handleChange = () => {
    setSubmitting(true);
    if (inputRef?.current?.files?.[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setPreviewUrl(e.target?.result);
      };

      reader.readAsDataURL(inputRef?.current?.files?.[0]);
    }
    if (inputRef?.current?.files?.[0]) {
      const formData = new FormData();
      formData.append('pitchDeck', inputRef?.current?.files?.[0]);
      try {
        mutation.mutate(formData, {
          onSettled: () => setSubmitting(false)
        });
      } catch (error) {
        setSubmitting(false);
        console.warn(error);
      }
    }
  };

  const handleOpenPitchDeck = () => {
    window.open(data?.pitchDeckUrl, '_blank');
  };

  const handleUploadClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  if (submitting) {
    return <Spinner />;
  }

  return (
    <div className={styles.CompanyPitchdeckTab}>
      <div className={styles.buttonsContainer}>
        <Button onClick={handleUploadClick}>
          <CloudUploadIcon />
          Upload
        </Button>
        <Button onClick={handleOpenPitchDeck}>
          Open
          <OpenInNewIcon />
        </Button>
      </div>
      {data?.pitchDeckUrl?.toLowerCase()?.endsWith('.pdf') ? (
        <embed src={data?.pitchDeckUrl} />
      ) : (
        <Image
          src={data?.pitchDeckUrl}
          alt="Pitch Deck"
          width={300}
          height={300}
        />
      )}
      <input ref={inputRef} hidden onChange={handleChange} type="file" />
    </div>
  );
};

export default CompanyPitchdeckTab;
