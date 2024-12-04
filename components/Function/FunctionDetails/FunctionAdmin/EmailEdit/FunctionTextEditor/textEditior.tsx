import clsx from 'clsx';
import {ChangeEvent, LegacyRef, useRef, useState} from 'react';
import {TinyMCE, Editor} from 'tinymce';
import classes from './textEditor.module.scss';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
const tinyMCEPlugins =
  'autolink lists link charmap preview anchor code fullscreen media wordcount emoticons';
const tinyMCEToolbar =
  'bold italic underline bullist numlist outdent indent link imgUploadButton media emoticons backcolor forecolor preview ';

const tinyMCEMenuBar = 'format insert edit view tools';

export const TextEditor = ({
  emailData,
  handleSubjectChange,
  handleEditorChange,
  setEmailData,
  mention
}: {
  emailData: Record<string, string>;
  setEmailData: any;
  handleSubjectChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEditorChange?: (content: string, editor: any) => void;
  mention?: JSX.Element;
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
    selector: '.tinymce',
    plugins: tinyMCEPlugins,
    toolbar: tinyMCEToolbar,
    menubar: tinyMCEMenuBar,
    branding: false,
    statusbar: true,
    convert_urls: false, // Disable URL conversion
    relative_urls: false, // Keep original URLs
    remove_script_host: false, // Keep the host part of the URL
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

        <div>
          <input
            className={clsx(classes.textfields)}
            type="text"
            required
            value={emailData?.subject}
            onChange={e => {
              setEmailData((prev: Record<string, string>) => ({
                ...prev,
                subject: e.target.value
              }));
            }}
            placeholder="Subject"
          />
        </div>
        <div>
          <input
            className={clsx(classes.textfields, classes.cc)}
            type="text"
            required
            placeholder="CC"
            value={emailData?.cc}
            onChange={e => {
              setEmailData((prev: Record<string, string>) => ({
                ...prev,
                cc: e.target.value
              }));
            }}
          />
        </div>
        <TinyMCEEditor
          onInit={(_, editor) => (editorRef.current = editor)}
          onLoadContent={() => setIsEditorLoaded(true)}
          onEditorChange={e => {
            setEmailData((prev: Record<string, string>) => ({
              ...prev,
              editor: e
            }));
          }}
          value={emailData?.editor}
          init={tinyMCEInit}
          child={mention}
          containerClass="position-relative"
        />
      </div>
    </>
  );
};
