import {
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
  DragEventHandler,
  useMemo
} from 'react';
import classes from './imageUpload.module.scss';
import clsx from 'clsx';
import {Spinner} from '../Spinner';
import {toast} from 'react-toastify';
import {ImageCarousel} from '../ImageCarousel';
import {faImage, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CarouselImage} from '../ImageCarousel/imageCarousel';
import {nanoid} from '@reduxjs/toolkit';

interface ImageUploadProps {
  containerClassName?: string;
  multiple?: boolean;
  onUpload: (url: string) => void;
  onDelete: (url: string) => void;
  uploadFn: (file: Blob) => Promise<any>;
  value: string | string[] | null;
}

const areImagesValid = (files: File[], multipleAllowed: boolean = false) => {
  if (!files?.length) return false;

  if (!multipleAllowed && files.length > 1) {
    toast.error(`At most 1 file can be uploaded`, {theme: 'dark'});
    return false;
  }

  if (files.some(file => !file.type.startsWith('image'))) {
    toast.error('Only Images can be uploaded', {theme: 'dark'});
    return false;
  }
  return true;
};

export const ImageUpload = ({
  containerClassName,
  multiple,
  onUpload,
  onDelete,
  uploadFn,
  value
}: ImageUploadProps) => {
  const [idToRawMap, setIdToRawMap] = useState<{[key: string]: string}>({});
  const [urlToIdMap, setUrlToIdMap] = useState<{[key: string]: string}>({});

  const [tempImages, setTempImages] = useState<CarouselImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const select = useCallback(() => inputRef.current?.click(), []);
  const [isDragging, setIsDragging] = useState(false);

  const dragCountRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const getSrcFromCache = (url: string) => {
    const id = urlToIdMap[url];
    return id ? idToRawMap[id] : undefined;
  };

  const confirmedImages: CarouselImage[] = useMemo(() => {
    if (multiple) {
      return (value as string[]).map((url, index) => ({
        loading: false,
        src: url,
        rawSrc: getSrcFromCache(url),
        key: index
      }));
    }
    return value
      ? [
          {
            loading: false,
            src: value as string,
            rawSrc: getSrcFromCache(value as string),
            key: 0
          }
        ]
      : [];
  }, [value]);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragCountRef.current += 1;
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    dragCountRef.current -= 1;
    if (dragCountRef.current === 0) setIsDragging(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = e => {
    dragCountRef.current = 0;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...(e.dataTransfer?.files ?? [])];
    if (areImagesValid(files, multiple)) {
      handleFileUpload(files);
    }
  };

  const handleSelectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target?.files ?? [])];
    if (areImagesValid(files, multiple)) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = (files: File[]) => {
    const totalImgs = tempImages.length + confirmedImages.length;

    files.forEach((file, index) => {
      const reader = new FileReader();
      const id = nanoid();

      reader.onload = e => {
        const placeholder = {
          key: id,
          src: e.target?.result as string,
          loading: true
        };
        multiple
          ? setTempImages(prev => {
              return [...prev, placeholder];
            })
          : setTempImages([placeholder]);

        reader.onload = null;

        if (multiple && index === files.length - 1) setActiveIndex(totalImgs);
        setIdToRawMap(prev => ({...prev, [id]: e.target?.result as string}));
      };

      reader.readAsDataURL(file);
      uploadFn(file).then(({data}) => {
        setUrlToIdMap(prev => ({...prev, [data.locationUrl]: id}));
        multiple
          ? setTempImages(prev => prev.filter(img => img.key !== id))
          : setTempImages([]);
        onUpload(data.locationUrl);
      });
    });
  };

  const images = useMemo(() => {
    if (multiple) {
      return [...confirmedImages, ...tempImages];
    } else {
      return tempImages.length || confirmedImages.length
        ? [tempImages[0] ?? confirmedImages[0]]
        : [];
    }
  }, [confirmedImages, tempImages]);

  return (
    <div
      className={clsx(
        classes.container,
        containerClassName,
        isDragging && images.length && classes.dragging
      )}
      onClick={images.length ? undefined : select}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      role={images.length ? '' : 'button'}
    >
      {!images.length && (
        <div
          className={clsx(
            classes.overlay,
            isDragging && classes.dragging,
            classes.darken
          )}
        >
          Drop photo{multiple ? 's' : ''} here or Click to Upload
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelectFiles}
        hidden
        multiple={multiple}
      />

      {!!images.length && (
        <>
          <div className={classes.icons}>
            {!images[activeIndex].loading && (
              <div className={clsx(classes.icon, classes.trash)}>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => {
                    setActiveIndex(activeIndex ? activeIndex - 1 : 0);
                    onDelete(images[activeIndex].src);
                  }}
                  title="Remove"
                />
              </div>
            )}
            {(!images[activeIndex].loading || multiple) && (
              <div className={classes.icon}>
                <FontAwesomeIcon
                  icon={multiple ? faPlus : faImage}
                  onClick={select}
                  title={multiple ? 'Add' : 'Replace'}
                />
              </div>
            )}
          </div>

          <ImageCarousel
            images={images}
            className={classes.carousel}
            activeIndex={activeIndex < images.length ? activeIndex : 0}
            onSelect={setActiveIndex}
          />
        </>
      )}
    </div>
  );
};
