import clsx from 'clsx';
import React, {useEffect, useMemo, useState} from 'react';
import classes from './commentsBox.module.scss';
import {CommentsFooter} from './components/commentsFooter';
import {Divider} from '../Divider';
import {
  CommentsCard,
  OnDeleteFn,
  OnEditSaveFn,
  OnMuteOrFollowFn
} from './components/commentsCard';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {TinyMCE} from 'tinymce';
import {Spinner} from '../Spinner';
import {useMentionPlugin} from '@/hooks/useMentionPlugin';
import {placeMentionPlugin} from '@/utils/common/helper';
import {Mention} from '@/components/Mention';

export interface CommentData {
  id: number;
  content: string;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
    companyName: string;
  };
  datetime: {
    creationDate: string;
    startTimePT: string;
    startTimeET: string;
  };
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
  muteThread?: boolean;
  followThread?: boolean;
  attachment: {
    filename: string;
    url: string;
  }[];
}

interface CommentBoxProps {
  data: CommentData[];
  loading: boolean;
  nextPage: number | null;
  forumId: string;
  fetchComments: ({page}: {page?: number}) => Promise<void>;
  postComment: (
    type: string,
    files: File[],
    comment: string,
    setCommentBoxText: React.Dispatch<React.SetStateAction<string>>,
    basePostAuthorProfileId: number
  ) => Promise<any>;
  postCommentLoading: boolean;
  onEditSave: OnEditSaveFn;
  onDeleteFn: OnDeleteFn;
  onMuteOrFollowFn: OnMuteOrFollowFn;
  basePostAuthorProfileId: number;
  expanded?: boolean;
}

export const tinyMCEPlugins =
  'autolink lists link charmap preview anchor emoticons';
// export const tinyMCEPlugins = 'link autoresize';
export const tinyMCEToolbar =
  'bold italic underline bullist numlist emoticons link';
export const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
  selector?: any;
  target?: any;
} = {
  menubar: false,
  plugins: tinyMCEPlugins,
  toolbar: tinyMCEToolbar,
  toolbar_location: 'bottom',
  toolbar_mode: 'floating',
  branding: false,
  statusbar: false,
  placeholder: 'Post a reply',
  convert_urls: false, // Disable URL conversion
  relative_urls: false, // Keep original URLs
  remove_script_host: false, // Keep the host part of the URL
  content_style: `
      *{
        white-space:pre-wrap;
       }
      p{
        margin:0 !important;
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
    `
};
export const CommentBox: React.FC<CommentBoxProps> = ({
  data,
  loading,
  nextPage,
  forumId,
  fetchComments,
  postComment,
  postCommentLoading,
  onEditSave,
  onDeleteFn,
  onMuteOrFollowFn,
  expanded,
  basePostAuthorProfileId
}) => {
  const [commentBoxText, setCommentBoxText] = useState('');
  const [tinyMCELoading, setTinyMCELoading] = useState(true);

  const {
    pluginPosition,
    setShow: setShowMention,
    show: showMention,
    mentionString,
    editor: editorRef
  } = useMentionPlugin();
  const mention =
    showMention && pluginPosition.current ? (
      <div
        style={{
          position: 'absolute',
          left: pluginPosition.current?.x,
          top: pluginPosition.current?.y + 20,
          zIndex: 10000000,
          color: 'black'
        }}
      >
        <Mention
          editor={editorRef.current}
          mentionString={mentionString.current ?? ''}
          setEditorData={setCommentBoxText}
          setShow={setShowMention}
          pluginPosition={pluginPosition}
        />
      </div>
    ) : (
      <></>
    );
  const handleEditorChange = (content: string, editor: any) => {
    placeMentionPlugin(
      editor,
      setShowMention,
      pluginPosition,
      mentionString,
      editorRef
    );
    setCommentBoxText(content);
  };
  const loadedComments = useMemo(() => {
    if (data.length === 0 && !loading) {
      return (
        <div className={clsx('text-center', classes.noComment)}>
          No replies, be the first to reply and show your support!
        </div>
      );
    }

    return data.map((comment, index) => (
      <React.Fragment key={comment.id}>
        <CommentsCard
          data={comment}
          forumId={forumId}
          onEditSave={onEditSave}
          onDeleteFn={onDeleteFn}
          onMuteOrFollowFn={onMuteOrFollowFn}
          expanded={expanded}
        />
        {index !== data.length - 1 && <Divider className="m-0" />}
      </React.Fragment>
    ));
  }, [data, loading]);

  return (
    <div
      className={clsx(classes.wrapper, 'd-flex', 'flex-column', 'gap-3', 'p-3')}
    >
      {tinyMCELoading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}

      <TinyMCEEditor
        onEditorChange={handleEditorChange}
        value={commentBoxText}
        init={tinyMCEInit}
        onLoadContent={() => setTinyMCELoading(false)}
        autoResize
        containerClass={clsx(
          classes.editorContainer,
          tinyMCELoading && 'd-none',
          'position-relative'
        )}
        child={mention}
      />

      <CommentsFooter
        commentBoxText={commentBoxText}
        id={forumId}
        postComment={postComment}
        loading={postCommentLoading}
        setCommentBoxText={setCommentBoxText}
        basePostAuthorProfileId={basePostAuthorProfileId}
      />
      <Divider className="m-0" />
      {loadedComments}
      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}
      <div className="d-flex gap-4 justify-content-center">
        {nextPage && !loading && (
          <a
            role="button"
            className="link"
            onClick={() => fetchComments({page: nextPage})}
          >
            Load More
          </a>
        )}
      </div>
    </div>
  );
};
