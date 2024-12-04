import {TinyMCE, Editor} from 'tinymce';
import classes from './requestIntroModal.module.scss';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {ProfileData} from '@/types/profile';
import {IntroProfileInfo} from '@/hooks/useIntroModal';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Button, ButtonVariants} from '@/ds/Button';
import clsx from 'clsx';
import {Spinner} from 'react-bootstrap';
import {addURLProtocol} from '@/utils/addURLProtocol';

const getIntroMessage = (
  userData: ProfileData,
  recipientData: IntroProfileInfo
) => {
  const {
    firstName,
    company: {name: companyName, url: companyUrl},
    socialLinks: {linkedin},
    cohortNominator: cohort,
    phone,
    email,
    plan
  } = userData;

  let userDetails = firstName
    ? `<strong>Name:</strong> ${firstName} <br />`
    : '';

  if (companyName) {
    userDetails += `<strong>Company:</strong> ${
      companyUrl
        ? `<a style="color: #15c" href="${addURLProtocol(
            companyUrl
          )}">${companyName}</a>`
        : companyName
    }<br />`;
  }

  userDetails += plan ? `<strong>Plan:</strong> _____ <br />` : '';
  userDetails += cohort ? `<strong>Cohort:</strong> ${cohort} <br />` : '';
  userDetails += linkedin
    ? `<strong>LinkedIn:</strong> ${linkedin} <br />`
    : '';
  userDetails += phone ? `<strong>Phone Number:</strong> ${phone} <br />` : '';
  userDetails += email ? `<strong>Email:</strong> ${email} <br />` : '';

  return `<p>
  Hey Success, <br />
  <br />
  I saw ${recipientData.firstName} had experience in { WRITE YOUR REASON FOR REQUESTING THE INTRO HERE } and would love an introduction. Thanks. <br /><br />
  </p>
  <p>
    ${userDetails}
  </p>`;
};

const tinyMCEPlugins =
  'autolink lists link charmap preview anchor code fullscreen wordcount emoticons';
const tinyMCEToolbar =
  'bold italic underline bullist numlist emoticons link imgUploadButton  code';

export const IntroRequestEditor = ({
  userData,
  recipientData,
  handleSubmitRequest,
  setIntroRequested
}: {
  userData?: ProfileData;
  recipientData: IntroProfileInfo;
  handleSubmitRequest: (message: string) => Promise<any>;
  setIntroRequested: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
    selector?: any;
    target?: any;
  } = {
    height: 380,
    max_height: 450,
    min_height: 300,
    selector: '.tinymce',
    menubar: false,
    plugins: tinyMCEPlugins,
    toolbar: tinyMCEToolbar,
    toolbar_location: 'bottom',
    toolbar_mode: 'floating',
    branding: false,
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
    p { margin: 0.5rem; }

    img {
      max-width:100%;
      max-height: 400px;
      border: 1px solid black;
      margin: 20px 10px;
      display: block;
    }

    @media (max-width: 500px) {
      body {
        font-size: 14px;
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

  const handleEditorChange = (content: string, _: any) => {
    setValue(content);
  };

  const handleSend = () => {
    setErr('');
    setSending(true);
    handleSubmitRequest(value)
      .then(() => {
        setValue('');
        setSending(false);
        setIntroRequested(true);
      })
      .catch(() => {
        setErr('Some Error Occured');
        setSending(false);
      });
  };

  useEffect(() => {
    if (userData?.id && isEditorLoaded) {
      setValue(getIntroMessage(userData, recipientData));
    }
  }, [isEditorLoaded, userData?.id]);

  return (
    <>
      {(!isEditorLoaded || !userData) && (
        <div className={classes.editorPlaceholder}>
          <Spinner />
        </div>
      )}
      <div
        className={clsx(
          classes.editorContainer,
          (!isEditorLoaded || !userData) && classes.hideEditor
        )}
      >
        <div className={classes.tinyMceEditor}>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
            multiple
          />
          <div className={classes.textfields}>
            <label>Request To : </label>
            <span>Success Team</span>
          </div>
          <div className={classes.textfields}>
            <label>Subject : </label>
            <span>
              Intro to {`${recipientData.firstName} ${recipientData.lastName}`}
            </span>
          </div>
          <TinyMCEEditor
            onInit={(_, editor) => (editorRef.current = editor)}
            onLoadContent={() => setIsEditorLoaded(true)}
            onEditorChange={handleEditorChange}
            value={value}
            init={tinyMCEInit}
            disabled={sending}
          />
        </div>
      </div>
      <div className={classes.footer}>
        {err && <div className="text-danger text-end  ">{err}</div>}
        <div className={classes.btnConatiner}>
          <Button
            type="submit"
            variant={ButtonVariants.BluePrimary}
            className={classes.btn}
            onClick={handleSend}
            disabled={sending}
            loadingChildren={'Sending'}
            loading={sending}
            textUppercase
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
