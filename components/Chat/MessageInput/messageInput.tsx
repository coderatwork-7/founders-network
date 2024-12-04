import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import defaultClasses from './messageInput.module.scss';
import popupClasses from './messageInputPopup.module.scss';
import {TinyMCE, Editor} from 'tinymce';
import clsx from 'clsx';
import {ChatContext} from '../ChatContext';
import {MessageType} from '../chatModal';
import {IconWrapper} from '@/ds/Icons';
import {faFile, faFileExcel} from '@fortawesome/free-regular-svg-icons';
import useAPI from '@/utils/common/useAPI';
import {selectUserInfo} from '@/store/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addChatUser,
  addMsgToQueue,
  removeMsgFromQueue
} from '@/store/reducers/chatReducer';
import {Spinner} from '@/ds/Spinner';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {toast} from 'react-toastify';
export interface AttachmentType {
  id: string;
  file?: File;
  url?: string;
  filename?: string;
}

const tinyMCEPlugins = 'autolink  emoticons';
const tinyMCEToolbar = 'emoticons imgUploadButton fileUploadButton sendButton';

export const MessageInput: React.FC<{
  isMobile: boolean;
  asPopup?: boolean;
  popupUser?: any;
}> = ({isMobile, asPopup, popupUser}) => {
  const classes = asPopup ? popupClasses : defaultClasses;

  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const editorRef = useRef<Editor | null>(null);
  const [msg, setMsg] = useState('');
  const [attachments, setAttachments] = useState<Array<AttachmentType>>([]);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  let {activeConv} = useContext(ChatContext);
  if (asPopup) activeConv = popupUser;
  const imgInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const msgDetailsRef = useRef<any>({
    attachments,
    recipient: activeConv?.userId
  });
  msgDetailsRef.current.attachments = attachments;
  msgDetailsRef.current.recipient = activeConv;
  msgDetailsRef.current.chatExists = !!activeConv?.lastMessageTimeStamp;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMobile) {
      editorRef.current?.on('keydown', handleKeyDown, true);
      return () => {
        editorRef.current?.off('keydown', handleKeyDown);
      };
    }
  }, [editorRef.current]);

  const postMessage = async (msg: MessageType, id: string) => {
    return await api(
      'postMessage',
      {
        userId: userInfo?.id ?? '',
        chatUserId: msgDetailsRef.current.recipient?.userId,
        msgId: id
      },
      {
        method: 'POST',
        data: msg
      }
    );
  };

  const handleAdd = (editor: Editor) => () => {
    const msg = editor
      .getContent()
      .replace(/^((<p>(?:&nbsp;|\s)*<\/p>)[\n\r]*)+/, '')
      .replace(/(((<p>(?:&nbsp;|\s)*<\/p>)[\n\r]*)+)$/, '');
    const id = Math.random();
    if (
      (msg.length > 0 && editor.getContent({format: 'text'}).trim()) ||
      msgDetailsRef.current.attachments.length > 0
    ) {
      if (!msgDetailsRef.current.chatExists)
        dispatch(
          addChatUser({
            ...msgDetailsRef.current.recipient,
            unreadCount: 0,
            lastMessageTimeStamp: new Date().toString(),
            messageSample: msg,
            hasMore: false,
            pageNum: 1
          })
        );

      dispatch(
        addMsgToQueue({
          messageId: id.toString(),
          sender: `${userInfo?.id}`,
          recipient: msgDetailsRef.current.recipient?.userId,
          message: msg,
          attachments: msgDetailsRef.current.attachments
        })
      );

      Promise.all(
        msgDetailsRef.current.attachments.map((attch: any) =>
          uploadFile(attch.file)
        )
      )
        .then(attchList =>
          postMessage(
            {
              message: msg,
              attachments: attchList.map(attch => attch.id)
            },
            id.toString()
          )
        )
        .catch(() => {
          dispatch(
            removeMsgFromQueue({
              chatUserId: msgDetailsRef.current.recipient?.userId,
              messageId: id.toString()
            })
          );
          toast.error(
            `Failed to send the message to ${msgDetailsRef.current.recipient?.name}, Please try again!`,
            {
              theme: 'dark'
            }
          );
        });
    }
    setMsg('');
    setAttachments([]);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && editorRef.current) {
      if (!e.shiftKey) {
        e.preventDefault();
        handleAdd(editorRef.current)();
        return false;
      }
      editorRef.current.execCommand('mceInsertNewLine');
      return false;
    }
  };

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files ?? [];
    const fileList: Array<AttachmentType> = [];

    for (const file of files) {
      fileList.push({id: `${Math.random()}`, filename: file.name, file});
    }
    setAttachments(list => [...list, ...fileList]);
    msgDetailsRef.current.attachments = [...attachments, ...fileList];

    event.target.value = '';
  }

  async function uploadFile(file: any) {
    const formData = new FormData();
    formData.append('s3file', file);

    const attachment: any = await api(
      'postFile',
      {},
      {
        method: 'POST',
        data: formData
      }
    );
    return {
      id: attachment.data.id,
      filename: attachment.data.fileName,
      url: attachment.data.locationUrl
    };
  }

  const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
    selector?: any;
    target?: any;
  } = {
    menubar: false,
    newline_behavior: 'block',
    plugins: tinyMCEPlugins,
    toolbar: tinyMCEToolbar,
    toolbar_location: 'bottom',
    toolbar_mode: 'floating',
    branding: false,
    statusbar: false,
    convert_urls: false, // Disable URL conversion
    relative_urls: false, // Keep original URLs
    remove_script_host: false, // Keep the host part of the URL
    autoresize_bottom_margin: 0,
    placeholder: 'Type a Message',
    content_style: `
      p {
        margin: 0 !important;
      }

      a {
      /* Add your link styles here */
      color: blue; /* Example link color */
      text-decoration: underline; /* Example underline */
    }

      .mce-content-body {
        border-radius: 10px;
        padding: 10px 10px 2px 12px !important;
        margin: 0;
        height: 100% !important;
        // overflow: hidden;
        cursor: text;
      }
      .mce-content-body:before {
        padding-left: 12px !important;
      }

      img {
        max-width:80%;
        max-height: 300px;
        border: 1px solid black;
        margin: 20px 10px;
        display: block;
      }
    `,
    setup: editor => {
      editor.ui.registry.addButton('imgUploadButton', {
        text: '',
        icon: 'image',
        tooltip: 'Attach Image',
        onAction: () => imgInputRef?.current?.click()
      });

      editor.ui.registry.addButton('fileUploadButton', {
        text: '',
        icon: 'link',
        tooltip: 'Attach File',
        onAction: () => fileInputRef?.current?.click()
      });

      editor.ui.registry.addButton('sendButton', {
        text: 'Send',
        onAction: handleAdd(editor)
      });
    }
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

  function removeAttachment(id: string): void {
    setAttachments(list => list.filter(file => file.id !== id));
  }

  return (
    <>
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        hidden
        multiple
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        hidden
        multiple
      />
      <div className={classes.tinyMceEditor}>
        {attachments.length > 0 && (
          <div className={classes.attachments}>
            {attachments.map(file => (
              <button
                key={file.id}
                className={classes.fileButton}
                onClick={() => removeAttachment(file.id)}
              >
                <IconWrapper
                  icon={faFile}
                  className={clsx([classes.fileIcon])}
                />
                <IconWrapper
                  icon={faFileExcel}
                  className={clsx([classes.fileIcon, classes.remove])}
                />
                <div className="text-truncate">{file.filename}</div>
              </button>
            ))}
          </div>
        )}

        <TinyMCEEditor
          onInit={(_, editor) => {
            editorRef.current = editor;
            editor.focus();
          }}
          onLoadContent={() => setIsEditorLoaded(true)}
          onEditorChange={(content, _) => {
            setMsg(content);
          }}
          value={msg}
          init={tinyMCEInit}
          autoResize
          containerClass={clsx(
            classes.editorContainer,
            !isEditorLoaded && classes.hideEditor
          )}
        />

        {!isEditorLoaded && (
          <div className={classes.editorPlaceholder}>
            <Spinner size="sm" />
          </div>
        )}
      </div>
    </>
  );
};
