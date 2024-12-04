import clsx from 'clsx';
import classes from './introRequestForm.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faUpload, faXmark} from '@fortawesome/free-solid-svg-icons';
import {MouseEventHandler, useCallback, useRef, useState} from 'react';
import useAPI from '@/utils/common/useAPI';
import {Spinner} from '@/ds/Spinner';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import Image from 'next/image';
import {IconWrapper} from '@/ds/Icons';
import {useFormContext} from 'react-hook-form';

export type AvatarType =
  | 'pitchDeck'
  | 'profileImageUrl'
  | 'companyImageUrl'
  | 's3file';

export interface AvatarWithButtonProp {
  avatarUrl?: string | null;
  inputUrl?: {url: string; onChange: (e: any) => void};
  caption: string;
  type: AvatarType;
  profileId?: number | null;
  onUpload?: (locationUrl: string) => void;
  onError?: () => void;
  onUploadStart?: () => void;
  confirmBeforeUploading?: boolean;
  containerClass?: string;
  btnContainerClass?: string;
  errorMessage?: string;
  name?: string;
}

const AvatarWithButton: React.FC<AvatarWithButtonProp> = ({
  avatarUrl,
  caption,
  type,
  onUpload,
  profileId,
  onError = () => {},
  onUploadStart = () => {},
  inputUrl,
  confirmBeforeUploading,
  containerClass,
  btnContainerClass,
  errorMessage,
  name
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const select = useCallback(() => inputRef.current?.click(), []);
  const makeApiCall = useAPI();
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const isS3Upload = type === 's3file';

  const methods = useFormContext();

  const handleCancelChange: MouseEventHandler<any> = e => {
    e.stopPropagation();
    setPendingConfirmation(false);
    setPreviewImage(null);
    inputRef.current && (inputRef.current.value = '');
  };

  const handleConfirmChange: MouseEventHandler<any> = e => {
    e.stopPropagation();
    upload();
    setPendingConfirmation(false);
    setPreviewImage(null);
    inputRef.current && (inputRef.current.value = '');
  };

  const handleChange = () => {
    if (confirmBeforeUploading) {
      if (inputRef?.current?.files?.[0]) {
        const reader = new FileReader();

        reader.onload = e => {
          setPendingConfirmation(true);
          setPreviewImage(e.target?.result);
        };

        reader.readAsDataURL(inputRef?.current?.files?.[0]);
      }

      if (name) {
        methods?.setValue(name, inputRef?.current?.files?.[0]);
      }

      return;
    }
    upload();
  };

  const upload = useCallback(async () => {
    try {
      if ((profileId || isS3Upload) && inputRef?.current?.files?.[0]) {
        onUploadStart();
        setLoading(true);
        const formData = new FormData();
        formData.append(type, inputRef?.current?.files?.[0] ?? '');
        const result = await makeApiCall(
          'postUploadImage',
          {
            type,
            profileId,
            concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
          },
          {data: formData, method: 'POST'}
        );
        onUpload?.(result?.data?.locationUrl);

        if (name) methods?.setValue(name, result?.data?.locationUrl);
        setPreviewImage(result?.data?.locationUrl);
        setLoading(false);
      }
    } catch (err) {
      console.log({err});
      onError();
      setLoading(false);
    }
  }, [makeApiCall, type, profileId, onUpload]);

  const renderPreview = (url: string) => {
    if (!url) {
      return <span>No Image</span>;
    } else if (isImage(url)) {
      return (
        <div
          style={{
            border: '1px solid #ced4da',
            width: '140px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            alt="Image"
            src={previewImage ?? url}
            height={120}
            width={120}
            className={clsx(classes.avatarImg, 'shadow-none border-0')}
            style={{objectFit: 'cover', objectPosition: 'center'}}
          />
        </div>
      );
    } else {
      return (
        <embed src={url} type="application/pdf" width="140px" height="150" />
      );
    }
  };

  const isImage = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return (
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png' ||
      extension === 'gif'
    );
  };

  return (
    <div className={clsx(errorMessage && classes.errorBoundary)}>
      {errorMessage && (
        <div className="text-danger textSmall text-center">{errorMessage}</div>
      )}
      <div
        className={clsx(classes.image, containerClass)}
        onClick={loading || pendingConfirmation ? undefined : select}
      >
        {!(avatarUrl || previewImage) || loading ? (
          <div
            className={clsx(
              classes.centeredContainer,
              isS3Upload ? 'h-100 w-100' : classes.upload
            )}
          >
            {loading ? <Spinner /> : <IconWrapper icon={faUpload} />}
          </div>
        ) : (
          (pendingConfirmation ? previewImage : avatarUrl) &&
          renderPreview(pendingConfirmation ? previewImage : avatarUrl)
        )}
        <div
          className={clsx(classes.transform, btnContainerClass)}
          style={{width: '140px'}}
        >
          {pendingConfirmation ? (
            <div className="w-100 border-0 rounded-0 p-0 bg-white d-flex fs-5 justify-content-center gap-3 py-1">
              <FontAwesomeIcon
                className={classes.icon}
                icon={faXmark}
                onClick={handleCancelChange}
                role="button"
              />
              <FontAwesomeIcon
                className={classes.icon}
                icon={faCheck}
                onClick={handleConfirmChange}
                role="button"
              />
            </div>
          ) : (
            <Button
              variant={ButtonVariants.OutlineSecondary}
              className={clsx(
                'w-100 border-0 rounded-0 p-0 ',
                classes.buttonHeight
              )}
              style={{backgroundColor: '#1c6867', color: 'white'}}
            >
              {caption}
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          hidden
          onChange={handleChange}
          type="file"
          id={`${type} Intro Form`}
          name={`${type} Intro Form`}
        />
      </div>
      {inputUrl !== undefined && (
        <>
          <p className={classes.orText}>OR</p>
          <input
            className={classes.inputBar}
            value={inputUrl.url}
            type="text"
            placeholder="Insert Link To Pitch Deck"
            onChange={inputUrl.onChange}
            id="intro-form-pitch-deck-url"
            name="intro-form-pitch-deck-url"
            style={{width: '140px'}}
          />
        </>
      )}
    </div>
  );
};

export {AvatarWithButton};
