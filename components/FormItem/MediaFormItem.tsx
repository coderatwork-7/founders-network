import {Button} from '@/ds/Button';
import FnText from '@/ds/FnText';
import {FormProvider, useForm} from 'react-hook-form';
import styles from './FormItem.module.scss';
import {useRef, useState} from 'react';
import FNInput from '@/ds/FNInput';
import {useGetMutationFunction} from '@/genericApi/foundersNetwork/mutations/useGetMutationFunction';
import {TMutation} from '@/utils/types/TMutation';
import {useFileUploadMutation} from '@/genericApi/foundersNetwork/mutations';
import {Spinner} from 'react-bootstrap';

interface IMediaFormItemProps {
  description?: string;
  name: string;
  placeholder?: string;
  title: string;
  value?: string;
  endpoint: TMutation;
}

export const MediaFormItem: React.FC<IMediaFormItemProps> = props => {
  const {description, endpoint, name, placeholder, title, value} = props;

  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useGetMutationFunction(endpoint);
  const fileMutation = useFileUploadMutation();

  const createDefaultValues = (key: string, value: any) => {
    return {
      [key]: value
    };
  };
  const defaultValues = createDefaultValues(name, value);

  const methods = useForm({
    defaultValues
  });

  const uploadFile = async (file: File) => {
    try {
      setSubmitting(true);
      const attachment = await fileMutation.mutateAsync(file);
      return attachment.data.locationUrl;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  };

  const onSubmit = async () => {
    await handleSaveVideo();

    const url = methods.getValues(name);

    try {
      setSubmitting(true);
      mutation.mutate(
        {[name]: url},
        {
          onSuccess: () => setEdit(false),
          onSettled: () => setSubmitting(false)
        }
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const handleClick = () => {
    setEdit(prevState => !prevState);
  };

  const handleSaveVideo = async () => {
    if (selectedFile) {
      try {
        const url = await uploadFile(selectedFile);
        methods.setValue(name, url);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setSelectedFile(file);
      methods.setValue(name, file.name);
    }
  };

  const handleOpenFileBrowser = () => {
    fileInputRef?.current?.click();
  };

  if (submitting) {
    return <Spinner />;
  }

  if (edit) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.editFormItem}
        >
          <div className={styles.formContent}>
            <div className={styles.row}>
              <div className={styles.inputsContainer}>
                <div>
                  <FnText>{title}</FnText>
                  {description && (
                    <FnText className={styles.description}>
                      {description}
                    </FnText>
                  )}
                </div>
                <div className={styles.introductionVideo}>
                  <FNInput
                    topLeftRounded
                    topRightRounded
                    bottomLeftRounded
                    bottomRightRounded
                    label="Introduction video"
                    name="introductionVideo"
                    placeholder="Paste a video link"
                  />

                  <FnText>Or</FnText>
                  <Button onClick={handleOpenFileBrowser}>Upload</Button>
                  <input
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <button onClick={handleClick} className={styles.editButton}>
                Cancel
              </button>
            </div>

            <Button type="submit" className={styles.submitButton}>
              Save
            </Button>
          </div>
          <div className={styles.screen} />
        </form>
      </FormProvider>
    );
  }

  return (
    <div className={styles.FormItem}>
      <div className={styles.textContainer}>
        <FnText type="heading-xxSmall" bold>
          {title}
        </FnText>
        {!!value ? (
          <FnText type="link" url={value}>
            {value}
          </FnText>
        ) : (
          <FnText>Not listed</FnText>
        )}
      </div>
      <button onClick={handleClick} className={styles.editButton}>
        Edit
      </button>
    </div>
  );
};
