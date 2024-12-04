import React, {useCallback, useRef} from 'react';
import clsx from 'clsx';
import classes from './fileUpload.module.scss';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {IconWrapper} from '../Icons';
interface FileUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  id?: string;
  name?: string;
}
export function FileUpload({files, setFiles, id, name}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const add: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event =>
      setFiles(prev => [...prev, ...Array.from(event.target.files ?? [])]),
    []
  );
  const removeFile: (fileName: string) => void = useCallback(
    (fileName: string) =>
      setFiles(prev => prev.filter(file => file.name !== fileName)),
    []
  );
  const select = useCallback(() => inputRef.current?.click(), []);
  return (
    <>
      <span className="cursorPointer">
        <IconWrapper icon={faPaperclip} className="fs-5" onClick={select} />
      </span>
      <div
        className={clsx(
          'd-flex',
          'align-items-center',
          'gap-1',
          'p-2',
          'flex-wrap',
          'text-truncate',
          'w-100'
        )}
      >
        {files.map(file => (
          <div
            key={file.name}
            className={clsx(
              'd-flex',
              'align-items-center',
              'py-0',
              'px-2',
              'rounded-1',
              'mw-100',
              'text-nowrap',
              classes.keyword
            )}
          >
            <span className={clsx('text-truncate')}>{file.name}</span>
            <button
              className={clsx(
                'ms-1',
                'bg-transparent',
                'border-0',
                'px-1',
                'd-flex align-item-center'
              )}
              onClick={() => removeFile(file.name)}
            >
              <div className={clsx('btn-close', classes.crossBtn)}></div>
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          multiple
          hidden
          onChange={add}
          type="file"
          id={id}
          name={name}
        />
      </div>
    </>
  );
}
