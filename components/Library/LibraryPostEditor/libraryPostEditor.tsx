import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import clsx from 'clsx';
import {ChangeEvent, useRef, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {Editor, TinyMCE} from 'tinymce';
import classes from './libraryPostEditor.module.scss';

const tinyMCEPlugins =
  'autolink lists link charmap preview anchor code fullscreen wordcount emoticons';
const tinyMCEToolbar =
  'bold italic underline aligncenter bullist numlist emoticons link imgUploadButton code';

export const LibraryPostEditor = ({
  value,
  onContentChange
}: {
  value?: string;
  onContentChange: (content: string) => void;
}) => {
  const editorRef = useRef<Editor | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
    selector?: any;
    target?: any;
  } = {
    height: 420,
    min_height: 400,
    menubar: false,
    statusbar: true,
    branding: false,
    selector: '.tinymce',
    toolbar: tinyMCEToolbar,
    plugins: tinyMCEPlugins,
    toolbar_mode: 'floating',
    toolbar_location: 'bottom',
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
    p { margin: 0.5rem; }

    a {
      /* Add your link styles here */
      color: blue; /* Example link color */
      text-decoration: underline; /* Example underline */
    }
    
    img {
      max-width:100%;
      max-height: 400px;
      vertical-align: middle;
    }
    
    @media (max-width: 449px) {
      body {
        font-size: 14px;
        margin: 6px 8px;
      }
    } 
    `
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  return (
    <>
      {!isEditorLoaded && (
        <div className={classes.editorPlaceholder}>
          <Spinner />
        </div>
      )}

      <div
        className={clsx(
          classes.tinyMceEditor,
          !isEditorLoaded && classes.hideEditor
        )}
      >
        <input
          hidden
          multiple
          type="file"
          accept="image/*"
          ref={imgInputRef}
          onChange={handleImageUpload}
        />

        <TinyMCEEditor
          init={tinyMCEInit}
          value={value}
          onEditorChange={handleEditorChange}
          onLoadContent={() => setIsEditorLoaded(true)}
          onInit={(_, editor) => (editorRef.current = editor)}
        />
      </div>
    </>
  );
};
