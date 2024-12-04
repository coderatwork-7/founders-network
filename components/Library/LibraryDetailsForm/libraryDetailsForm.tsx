import {AvatarWithButton} from '@/components/Intro/avatarWithButton';
import useLibraryTags, {
  TagOptionType
} from '@/components/LibraryPage/hooks/useLibraryTags';
import {LibraryItem} from '@/components/LibraryPage/libraryPage';
import Card from '@/ds/Card/card';
import {Spinner} from '@/ds/Spinner';
import {LIBRARY_ITEM_TYPES} from '@/utils/common/constants';
import useAPI from '@/utils/common/useAPI';
import clsx from 'clsx';
import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import ReactSelect, {MultiValue, createFilter} from 'react-select';
import {toast} from 'react-toastify';
import {
  LibraryItemUpdateType,
  ValidationObjType
} from '../LibraryModal/libraryModal';
import {LibraryPostEditor} from '../LibraryPostEditor/libraryPostEditor';
import classes from './libraryDetailsForm.module.scss';
import {ImageUpload} from '@/components/ImageUpload/imageUpload';

interface LibraryDetailsForm {
  data?: LibraryItem;
  itemType: string;
  formData: LibraryItemUpdateType;
  setFormData: React.Dispatch<React.SetStateAction<LibraryItemUpdateType>>;
  validations: ValidationObjType;
  setValidations: React.Dispatch<React.SetStateAction<ValidationObjType>>;
}

const getNoOptionsMessage = ({inputValue}: {inputValue: string}) =>
  inputValue.length ? (
    'No Matches Found'
  ) : (
    <div className="text-danger">Error fetching Tags</div>
  );

export const LibraryDetailsForm: React.FC<LibraryDetailsForm> = ({
  data,
  itemType,
  formData,
  setFormData,
  validations,
  setValidations
}) => {
  const api = useAPI();
  const [dataRequested, setDataRequested] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const {tags, loading: tagsLoading} = useLibraryTags(itemType);
  const tagOptions = useMemo(() => (tags ? Object.values(tags) : []), [tags]);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        tags:
          data.tags?.map(t => ({
            label: t,
            value: t
          })) ?? []
      });

      if (data.id && !data.details && !dataRequested) {
        setLoadingDetails(true);
        setDataRequested(true);
        api('getLibraryItem', {type: itemType, id: data.id})
          .then(() => setLoadingDetails(false))
          .catch(() => setLoadingDetails(false));
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && tags) {
      setFormData({
        ...data,
        tags: data.tags?.map(t => tags[t]) ?? []
      });
    }
  }, [data, tags]);

  const handleCoverImgChange = (url: File | null) => {
    if (url && !validations.coverImage) {
      setValidations(v => ({
        ...v,
        coverImage: true,
        invalidCount: v.invalidCount - 1
      }));
    }
    if (url) {
      const reader = new FileReader();

      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          coverImageUrl: e.target?.result as string
        }));
      };
    } else {
      setFormData(prev => ({...prev, coverImageUrl: undefined}));
    }
    setFormData(prev => ({...prev, coverImage: url}));
  };

  const handleTagsChange = (selectedTags: MultiValue<TagOptionType>) => {
    setFormData(prevData => ({
      ...prevData,
      tags: selectedTags
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prevData => ({
      ...prevData,
      details: content
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    if (
      value &&
      name in validations &&
      !validations[name as keyof ValidationObjType]
    ) {
      setValidations(v => ({
        ...v,
        [name]: true,
        invalidCount: v.invalidCount - 1
      }));
    }
    setFormData(prevData => ({...prevData, [name]: value}));
  };
  if (loadingDetails)
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );

  return (
    <form>
      <Card className={classes.card}>
        <div className={classes.field}>
          <div className={classes.label}>
            Cover Image <span className="text-danger">*</span>
          </div>

          <div className="w-100">
            <ImageUpload
              previewImage={formData?.coverImage ?? formData?.coverImageUrl}
              setPreviewImage={handleCoverImgChange}
            />

            {!validations.coverImage && (
              <div className={classes.err}>Cover Image is Required</div>
            )}
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            Title<span className="text-danger">*</span>
          </div>

          <div className={classes.fieldInput}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
            />

            {!validations.title && (
              <div className={classes.err}>Post Title is Required</div>
            )}
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            Subtitle<span className="text-danger">*</span>
          </div>

          <div className={classes.fieldInput}>
            <textarea
              name="subtitle"
              onChange={handleChange}
              value={formData.subtitle}
              placeholder="Post Description"
              rows={3}
            />

            {!validations.subtitle && (
              <div className={classes.err}>Post Description is Required</div>
            )}
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>Order</div>
          <div className={classes.fieldInput}>
            <input
              type="number"
              name="order"
              onChange={handleChange}
              placeholder="Sort Order"
              value={formData.order}
            />
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>Tags</div>
          <div className={classes.fieldInput}>
            <ReactSelect
              isMulti
              required={true}
              options={tagOptions}
              value={formData.tags}
              isLoading={tagsLoading}
              placeholder="Post Tags"
              closeMenuOnSelect={false}
              onChange={handleTagsChange}
              className={classes.selectInput}
              menuShouldScrollIntoView={false}
              loadingMessage={() => 'Loading'}
              noOptionsMessage={getNoOptionsMessage}
              filterOption={createFilter({ignoreAccents: false})}
              classNames={{
                control: () => clsx(classes.control, 'form-control py-0'),
                placeholder: () => classes.placeholder,
                valueContainer: state => (state.hasValue ? 'py-2' : 'py-0'),
                indicatorSeparator: ({hasValue}) =>
                  clsx(classes.btnSeparator, !hasValue && 'd-none'),
                multiValueLabel: () => classes.tag,
                clearIndicator: () => classes.removeBtn
              }}
            />
          </div>
        </div>
      </Card>

      <Card className={classes.card}>
        <div className={classes.editorLabel}>Post Content</div>

        <LibraryPostEditor
          value={formData?.details}
          onContentChange={handleEditorChange}
        />
      </Card>
    </form>
  );
};
