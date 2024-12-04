import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import {CommentData, tinyMCEInit} from '../commentsBox';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Parse from 'html-react-parser';
import {CommentsCardHeader} from './commentsCardHeader';
import {IconWrapper} from '@/ds/Icons';
import classes from '../commentsBox.module.scss';
import {LikeHeart} from '@/components/Common/likeHeart';
import {CONST_FORUMS} from '@/utils/common/constants';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {Button, ButtonVariants} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import DOMPurify from 'isomorphic-dompurify';
import {placeMentionPlugin} from '@/utils/common/helper';
import {processAnchorTagAndEmoji} from '@/utils/common/help';
import {useMentionPlugin} from '@/hooks/useMentionPlugin';
import {Mention} from '@/components/Mention';

type SetStateBoolean = Dispatch<SetStateAction<boolean>>;
export type OnEditSaveFn = (
  content: string,
  setLoading: SetStateBoolean,
  setEditing: SetStateBoolean,
  commentId: number,
  forumId: string
) => Promise<any>;

export type OnDeleteFn = (
  setLoading: SetStateBoolean,
  commentId: number,
  forumId: string
) => Promise<any>;

export type OnMuteOrFollowFn = (
  setLoading: Dispatch<SetStateAction<'notLoading' | 'follow' | 'mute'>>,
  commentId: number,
  flag: 'follow' | 'mute' | 'unmute',
  commentAuthorProfileId?: number,
  followed?: boolean
) => Promise<any>;

export const CommentsCard: React.FC<{
  data: CommentData;
  forumId: string;
  onEditSave: OnEditSaveFn;
  onDeleteFn: OnDeleteFn;
  onMuteOrFollowFn: OnMuteOrFollowFn;
  expanded?: boolean;
}> = ({
  data,
  forumId,
  onEditSave,
  onDeleteFn,
  onMuteOrFollowFn,
  expanded = false
}) => {
  const {
    content,
    id,
    like: {count: likeCount, liked, profile: likedProfiles},
    attachment
  } = data;
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(content);
  const [tinyMCELoading, setTinyMCELoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    editor: editorRef,
    mentionString,
    pluginPosition,
    setShow: setShowMention,
    show: showMention
  } = useMentionPlugin();
  const handleEditorChange = useCallback((content: string, editor: any) => {
    placeMentionPlugin(
      editor,
      setShowMention,
      pluginPosition,
      mentionString,
      editorRef
    );
    setEditData(content);
  }, []);

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
          setEditorData={setEditData}
          setShow={setShowMention}
          pluginPosition={pluginPosition}
        />
      </div>
    ) : (
      <></>
    );

  return (
    <div className={clsx('d-flex flex-column gap-2')}>
      <CommentsCardHeader
        data={data}
        setEditing={setEditing}
        editing={editing}
        onDeleteFn={() => onDeleteFn(setLoading, id, forumId)}
        onMuteOrFollowFn={onMuteOrFollowFn}
      />
      {editing ? (
        <>
          {tinyMCELoading && (
            <div className="text-center">
              <Spinner />
            </div>
          )}
          <div className={clsx('w-100', tinyMCELoading && 'invisible')}>
            <TinyMCEEditor
              onEditorChange={handleEditorChange}
              value={editData}
              init={tinyMCEInit}
              onLoadContent={() => setTinyMCELoading(false)}
              child={mention}
              containerClass="position-relative"
              autoResize
            />
            <div className="d-flex mt-3">
              <div className="d-flex gap-2 ms-auto">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Button
                      variant={ButtonVariants.Primary}
                      size="sm"
                      className="text-nowrap"
                      onClick={() =>
                        onEditSave(
                          editData,
                          setLoading,
                          setEditing,
                          id,
                          forumId
                        )
                      }
                    >
                      Save
                    </Button>
                    <Button
                      variant={ButtonVariants.OutlinePrimary}
                      size="sm"
                      className="text-nowrap"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : loading ? (
        <div className="d-flex justify-content-center">
          <Spinner />
        </div>
      ) : (
        <div
          className={clsx([
            'overrideDefault',
            classes.content,
            expanded && classes.expanded
          ])}
        >
          {Parse(DOMPurify.sanitize(content), {
            replace: processAnchorTagAndEmoji
          })}
        </div>
      )}
      {attachment.length !== 0 && (
        <div className="d-flex gap-2">
          {attachment.map(file => (
            <div
              className={clsx(
                classes.attachment,
                'py-1',
                'px-2',
                'd-flex',
                'gap-2',
                'align-items-center'
              )}
              key={file.filename}
            >
              <IconWrapper icon={faPaperclip} />
              <a href={file.url}>{file.filename}</a>
            </div>
          ))}
        </div>
      )}
      <div className="d-flex gap-4 align-items-center">
        {/* TODO: Comments Like API backend not working */}
        <LikeHeart
          count={likeCount}
          isLiked={liked}
          likedBy={likedProfiles}
          feedsType={CONST_FORUMS}
          id={forumId}
          commentId={id}
          feedsTypeMapping={CONST_FORUMS}
        />
      </div>
    </div>
  );
};
