import clsx from 'clsx';
import {ChangeEvent, LegacyRef, useRef, useState} from 'react';
import {TinyMCE, Editor} from 'tinymce';
import classes from '../createForumFeed.module.scss';
import {PopoverFacet} from '@/ds/PopoverFacet';
import {FacetState} from '@/utils/common/commonTypes';
import {DropdownItem} from '@/types/dropdown';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {Spinner} from 'react-bootstrap';

const tinyMCEPlugins =
  'autolink lists advlist link charmap insertdatetime preview anchor code image fullscreen media wordcount emoticons ' +
  'autocorrect searchreplace autoresize visualblocks wordcount permanentpen quickbars linkchecker formatpainter tinymcespellchecker powerpaste';
const tinyMCEToolbar =
  'emoticons styles backcolor  aidialog aishortcuts bold italic underline | align bullist numlist link imgUploadButton image media';
const facetName = 'Select posting to';
const facetKey = 'postingTo';
export const TextEditor = ({
  postingTo,
  subject,
  value,
  dropdownData,
  subjectInputRef,
  setPostingTo,
  handleSubjectChange,
  handleEditorChange,
  mention
}: {
  postingTo: DropdownItem;
  subject: string;
  value: string;
  dropdownData: {
    [key: string]: DropdownItem;
  };
  subjectInputRef: LegacyRef<HTMLInputElement>;
  setPostingTo: React.Dispatch<React.SetStateAction<DropdownItem>>;
  handleSubjectChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEditorChange: (content: string, editor: any) => void;
  mention: JSX.Element;
}) => {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
    selector?: any;
    target?: any;
  } = {
    height: 400,
    min_height: 300,
    max_height: 600,
    selector: '.tinymce',
    menubar: false,
    plugins: tinyMCEPlugins,
    toolbar: tinyMCEToolbar,
    toolbar_location: 'bottom',
    toolbar_mode: 'floating',
    branding: false,
    convert_urls: false, // Disable URL conversion
    relative_urls: false, // Keep original URLs
    remove_script_host: false, // Keep the host part of the URL
    quickbars_image_toolbar: false,
    quickbars_insert_toolbar: false,
    statusbar: true,
    setup: editor => {
      editor.ui.registry.addButton('imgUploadButton', {
        text: '',
        icon: 'image',
        tooltip: 'Attach Image',
        onAction: () => imgInputRef?.current?.click()
      });
    },
    content_style: ` 
    *{
        white-space:pre-wrap;
     }
    p { margin: 0.5rem; }

    a {
      /* Add your link styles here */
      color: blue; /* Example link color */
      text-decoration: underline; /* Example underline */
    }

    img {
      max-width:100%;
      max-height: 400px;
      border: 1px solid black;
      margin: 20px 10px;
      display: block;
    }

    .mce-object-iframe {
      display: block;
      width: min-content;
    }
  `
  };

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files ?? [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target?.result;
        const imageHtml = `<img src="${imageUrl}" alt="Inserted Image" />`;
        editorRef.current?.insertContent(imageHtml);
      };
      file && reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  return (
    <>
      {!isEditorLoaded && (
        <div className={classes.editorPlaceholder}>
          <Spinner />
        </div>
      )}
      <div
        className={clsx(
          'w-100',
          classes.tinyMceEditor,
          !isEditorLoaded && classes.hideEditor
        )}
      >
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
          multiple
        />
        <div className={clsx('pe-2', classes.textfields, classes.posting)}>
          <label>Posting To:</label>
          {dropdownData ? (
            <PopoverFacet
              facetValues={Object.values(dropdownData ?? {}).map(element => ({
                ...element,
                facetValueKey: element.id,
                facetValueName: element.name
              }))}
              isSearchable={true}
              facetName={facetName}
              facetKey={facetKey}
              selectedItems={
                postingTo?.id || (postingTo?.id as any) === 0
                  ? {
                      [facetKey]: {
                        [postingTo.id]: {
                          facetValueKey: postingTo.id,
                          facetValueName: postingTo.name
                        }
                      }
                    }
                  : {}
              }
              facetValueOnClick={(obj: FacetState) => {
                setPostingTo({
                  id: '',
                  name: '', //Ask
                  ...Object.values(obj?.[facetKey] ?? {})?.[0]
                });
              }}
              showSelected
              isMultiselect={false}
              trigger="click"
            />
          ) : (
            <Spinner size="sm" />
          )}
        </div>
        <div className={clsx(classes.textfields, classes.subject)}>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            ref={subjectInputRef}
            required
            className="pe-2"
            onChange={handleSubjectChange}
          />
        </div>
        <TinyMCEEditor
          onInit={(_, editor) => (editorRef.current = editor)}
          onLoadContent={() => setIsEditorLoaded(true)}
          onEditorChange={handleEditorChange}
          value={value}
          init={tinyMCEInit}
          child={mention}
          containerClass="position-relative"
        />
      </div>
    </>
  );
};
