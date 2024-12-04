import DisplayDateTime from '@/components/Common/displayDateTime';
import ForumContent from './forumContent';
import ForumTitle from './forumTitle';
import Card from '@/ds/Card/card';
import CardHeader from '@/ds/Card/cardHeader';
import {TYPE_FORUMS} from '@/utils/common/commonTypes';
import CardContent from '@/ds/Card/cardContent';
import CardFooter from '@/ds/Card/cardFooter';
import {
  CommentIcon,
  CommentsIcon,
  EllipsisIcon,
  VerticalEllipsisIcon
} from '@/ds/Icons';
import ForumMenuOverlay from './forumMenuOverlay';
import {DropdownItem} from '@/types/dropdown';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import {CommentBox, CommentData} from '@/ds/CommentsBox/commentsBox';
import useAPI from '@/utils/common/useAPI';

import {CONST_FORUMS} from '@/utils/common/constants';
import {Divider} from '@/ds/Divider/divider';
import {LikeHeart} from '@/components/Common/likeHeart';
import clsx from 'clsx';
import {
  extractUrlParams,
  getMentionedArray,
  isObjectEmpty,
  placeMentionPlugin
} from '@/utils/common/helper';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {
  OnDeleteFn,
  OnEditSaveFn,
  OnMuteOrFollowFn
} from '@/ds/CommentsBox/components/commentsCard';
import {PutFollowMutePayload} from '@/genericApi/foundersNetwork/commentsAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {Popover} from '@/ds/Popover';
import {TinyMCEEditor} from '@/ds/TinyMCEEditor';
import {Button, ButtonVariants} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {TinyMCE} from 'tinymce';
import classes from './forumCard.module.scss';
import {toast} from 'react-toastify';
import {useMentionPlugin} from '@/hooks/useMentionPlugin';
import {Mention} from '@/components/Mention';

export interface ForumCardResponse {
  id: string;
  threadId: string;
  type: TYPE_FORUMS;
  author: {
    profileId: number;
    name: string;
    badge?: string;
    avatarUrl: string;
    companyName: string;
    expertise?: string[];
    designation?: string;
  };
  datetime: {
    creationDate: string;
  };
  title: string;
  analytics?: {
    comment?: number;
    privateComment?: number;
  };
  detail: {
    content: string;
  };
  like?: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
  showOptions?: boolean;
  postedTo?: string | DropdownItem;
  muteThread?: boolean;
  followThread?: boolean;
  comments?: CommentData[];
}
const tinyMCEPlugins =
  'autolink lists link image charmap preview anchor code fullscreen media wordcount emoticons';
const tinyMCEToolbar =
  'bold italic underline bullist numlist emoticons link image media code';

const tinyMCEInit: Parameters<TinyMCE['init']>[0] & {
  selector?: any;
  target?: any;
} = {
  height: 400,
  min_height: 300,
  selector: '.tinymce',
  menubar: false,
  plugins: tinyMCEPlugins,
  toolbar: tinyMCEToolbar,
  toolbar_location: 'bottom',
  toolbar_mode: 'floating',
  branding: false,
  statusbar: true,
  convert_urls: false, // Disable URL conversion
  relative_urls: false, // Keep original URLs
  remove_script_host: false, // Keep the host part of the URL
  content_style: `
  p { margin: 0.5rem; } 
  *{
      white-space:pre-wrap;
   }

   a {
      /* Add your link styles here */
      color: blue; /* Example link color */
      text-decoration: underline; /* Example underline */
    }

  img {
    max-width:100%;
    max-height: 400px;
    margin: 20px 10px;
    display: block;
  }

  .mce-object-iframe {
    display: block;
    width: min-content;
  }`
};
export interface ForumCardProps {
  data: ForumCardResponse;
  expanded?: boolean;
}

interface AuthorDetailsProps {
  data: ForumCardResponse;
  expanded?: boolean;
  threeDotMenu?: ReactNode;
}
export type PostMute = (
  setLoading: Dispatch<
    SetStateAction<'notLoading' | 'follow' | 'mute' | 'delete'>
  >
) => Promise<any>;

interface ThreeDotMenuProps {
  data: ForumCardResponse;
  setEditData: React.Dispatch<React.SetStateAction<string>>;
  setEditingPost: React.Dispatch<React.SetStateAction<boolean>>;
  forceClose?: boolean;
  vertical?: boolean;
  postFollow: any;
  postMute: PostMute;
  postDelete: PostMute;
}

export default function ForumCard({
  data,
  expanded = false
}: ForumCardProps): JSX.Element {
  const {
    id,
    threadId,
    analytics,
    author: {profileId: basePostAuthorProfileId},
    detail,
    title,
    type = CONST_FORUMS,
    like,
    showOptions = true,
    comments,
    muteThread
  } = data ?? {};

  const [showComments, setShowComments] = useState(expanded);
  const [loadingComments, setLoadingComments] = useState(false);
  const [nextCommentsPage, setNextCommentsPage] = useState<null | number>(null);
  const [response, setResponse] = useState<{[key: string]: any}>();
  const makeAPICall = useAPI();
  const [postCommentLoading, setPostCommentLoading] = useState(false);
  const userData = useSelector(selectUserInfo());
  const {id: userId} = userData ?? {};
  const [editingPost, setEditingPost] = useState(false);
  const [editData, setEditData] = useState(detail?.content);
  const [editTitle, setEditTitle] = useState(title);
  const [tinyMCELoading, setTinyMCELoading] = useState(true);
  const postEditForumPostLoading = !!useSelector(
    selectApiState('postEditForumPost')
  );
  const {
    pluginPosition,
    setShow: setShowMention,
    show: showMention,
    mentionString,
    editor: editorRef
  } = useMentionPlugin();
  const handleEditorChange = (editorData: string, editor: any) => {
    placeMentionPlugin(
      editor,
      setShowMention,
      pluginPosition,
      mentionString,
      editorRef
    );
    setEditData(editorData);
  };
  const fetchComments = useCallback(
    async ({page = 1}: {page?: number}) => {
      if ((!comments || page !== 1) && userId) {
        setLoadingComments(true);
        const response = await makeAPICall('getForumComments', {
          forumId: id,
          page
        });
        setResponse(response);
        setLoadingComments(false);
      }
    },
    [comments, id, makeAPICall, userId]
  );

  const handleCommentClick = useCallback(() => {
    setShowComments(prevState => !prevState);
    fetchComments({});
  }, [fetchComments]);

  useEffect(() => {
    if (expanded) fetchComments({});
  }, [id, userId]);

  useEffect(() => {
    if (response?.data?.next) {
      const pageNumber =
        extractUrlParams({
          link: response?.data?.next,
          param: 'page'
        }) || '';
      setNextCommentsPage(parseInt(pageNumber));
    } else setNextCommentsPage(null);
  }, [response]);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('s3file', file);

    const attachment: any = await makeAPICall(
      'postFile',
      {},
      {
        method: 'POST',
        data: formData
      }
    );
    return {
      id: attachment.data.id,
      name: attachment.data.fileName,
      url: attachment.data.locationUrl
    };
  }

  const postComment = useCallback(
    async (
      type: string,
      files: File[],
      comment: string,
      setCommentBoxText: React.Dispatch<React.SetStateAction<string>>,
      basePostAuthorProfileId: number
    ) => {
      if (comment === '') {
        toast.error('Comment cannot be blank', {theme: 'dark'});
        return;
      }
      try {
        setPostCommentLoading(true);
        const uploadResponseData = await Promise.all(
          files.map(file => uploadFile(file))
        );
        await makeAPICall(
          'postForumComment',
          {forumId: id},
          {
            data: {
              content: comment,
              type,
              attachments: uploadResponseData.map(e => e.id),
              mentioned: getMentionedArray(comment),
              to: basePostAuthorProfileId
            },
            method: 'POST'
          }
        );
        setCommentBoxText('');
        if (type === 'reply')
          toast.success('Added private reply!', {theme: 'dark'});
      } catch (err) {
        toast.error('Something went wrong, try again', {theme: 'dark'});
      } finally {
        setPostCommentLoading(false);
      }
    },
    [id, uploadFile, makeAPICall]
  );

  const onEditSave: OnEditSaveFn = useCallback(
    async (content, setLoading, setEditing, commentId, forumId) => {
      setLoading(true);
      try {
        await makeAPICall(
          'putEditComment',
          {commentId, forumId},
          {
            method: 'PUT',
            data: {content, mentioned: getMentionedArray(content)}
          }
        );
        setEditing(false);
      } catch (err) {
        toast.error('Error editing comment', {theme: 'dark'});
      } finally {
        setLoading(false);
      }
    },
    [makeAPICall]
  );
  const onDeleteFn: OnDeleteFn = useCallback(
    async (setLoading, commentId, forumId) => {
      setLoading(true);
      try {
        await makeAPICall(
          'deleteComment',
          {commentId, forumId},
          {method: 'DELETE'}
        );
      } catch (err) {
        setLoading(false);
        toast.error('error deleting', {theme: 'dark'});
      }
    },
    [makeAPICall]
  );

  const onMuteOrFollowFn: OnMuteOrFollowFn = useCallback(
    async (setLoading, commentId, flag, commentAuthorProfileId, follow) => {
      setLoading(flag === 'unmute' ? 'mute' : flag);
      try {
        const payload: PutFollowMutePayload = {
          commentId,
          flag,
          userId,
          forumId: id
        };
        const options: any = {method: 'PUT'};
        if (flag === 'follow') {
          options.data = {
            authorId: commentAuthorProfileId,
            follow: !follow
          };
        }

        await makeAPICall(
          'putFollowMute',
          {...payload, concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest},
          options
        );
      } catch (err) {
        toast.error('error making request', {theme: 'dark'});
      } finally {
        setLoading('notLoading');
      }
    },
    [makeAPICall]
  );

  const postEditData = useCallback(async () => {
    try {
      await makeAPICall(
        'postEditForumPost',
        {forumId: id, userId: userData?.id, threadId},
        {
          method: 'POST',
          data: {
            data: {
              content: editData,
              title: editTitle,
              mentioned: getMentionedArray(editData)
            }
          }
        }
      );
      setEditingPost(false);
    } catch (err) {
      toast.error('Something went wrong while editing', {theme: 'dark'});
    }
  }, [makeAPICall, editData, editTitle, userData]);
  const postFollow = useCallback(
    async (
      follow: boolean,
      setLoading: Dispatch<SetStateAction<'notLoading' | 'follow' | 'mute'>>
    ) => {
      try {
        setLoading('follow');
        await makeAPICall(
          'postFollowPost',
          {userId: userData?.id, forumId: id},
          {
            method: 'POST',
            data: {
              data: {
                follow,
                authorId: basePostAuthorProfileId
              }
            }
          }
        );
      } catch (err) {
        toast.error('Request failed', {theme: 'dark'});
      } finally {
        setLoading && setLoading('notLoading');
      }
    },
    [makeAPICall, userData, id, basePostAuthorProfileId]
  );
  const postDelete: PostMute = useCallback(
    async setLoading => {
      try {
        setLoading('delete');
        await makeAPICall(
          'deleteForumPost',
          {
            userId: userData?.id,
            forumId: id
          },
          {method: 'DELETE'}
        );
      } catch (err) {
        toast.error('Could not delete', {theme: 'dark'});
      } finally {
        typeof setLoading === 'function' && setLoading('notLoading');
      }
    },
    [makeAPICall, userData, id]
  );
  const postMute: PostMute = useCallback(
    async setLoading => {
      try {
        setLoading('mute');
        await makeAPICall(
          'putMuteForumPost',
          {
            userId: userData?.id,
            forumId: id,
            mute: !muteThread
          },
          {method: 'PUT'}
        );
      } catch (err) {
        toast.error('Request Failed', {theme: 'dark'});
      } finally {
        setLoading('notLoading');
      }
    },
    [makeAPICall, muteThread, userData, id]
  );
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
  const threeDotMenu = showOptions ? (
    <ThreeDotMenu
      data={data}
      setEditData={setEditData}
      setEditingPost={setEditingPost}
      vertical={expanded}
      forceClose={editingPost}
      postFollow={postFollow}
      postMute={postMute}
      postDelete={postDelete}
    />
  ) : (
    <></>
  );
  const forumContent = (
    <>
      {!expanded && (
        <>
          <AuthorDetails
            data={data}
            threeDotMenu={threeDotMenu}
            expanded={expanded}
          />
          <Divider />
        </>
      )}
      <CardContent>
        {editingPost ? (
          <>
            {tinyMCELoading && (
              <div className="text-center">
                <Spinner />
              </div>
            )}
            <div className={clsx('w-100', tinyMCELoading && 'invisible')}>
              <textarea
                value={editTitle}
                onChange={e => setEditTitle(e.currentTarget.value)}
                className={clsx('w-100 rounded-1 px-2', classes.border)}
              >
                {title}
              </textarea>
              <TinyMCEEditor
                onEditorChange={handleEditorChange}
                value={editData}
                init={tinyMCEInit}
                onLoadContent={() => setTinyMCELoading(false)}
                child={mention}
                containerClass="position-relative"
              />
              <div className="d-flex mt-3">
                <div className="d-flex gap-2 ms-auto">
                  {postEditForumPostLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <Button
                        variant={ButtonVariants.Primary}
                        size="sm"
                        className="text-nowrap"
                        onClick={postEditData}
                      >
                        Save
                      </Button>
                      <Button
                        variant={ButtonVariants.OutlinePrimary}
                        size="sm"
                        className="text-nowrap"
                        onClick={() => setEditingPost(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <ForumContent
            threadId={threadId}
            title={title}
            content={detail?.content}
            expanded={expanded}
            authorDetails={
              expanded ? (
                <AuthorDetails data={data} expanded={expanded} />
              ) : undefined
            }
            threeDotMenu={threeDotMenu}
          />
        )}
      </CardContent>
      {!expanded && (detail?.content || title) ? <Divider /> : null}
      {!isObjectEmpty(like ?? {}) && (
        <CardFooter>
          <div
            className={clsx([
              'horizontalDisplayer',
              expanded && 'fs-5 gap-3 my-3'
            ])}
          >
            <LikeHeart
              count={like?.count}
              isLiked={like?.liked}
              likedBy={like?.profile}
              feedsType={type}
              id={id}
              size={expanded ? 'lg' : 'sm'}
              feedsTypeMapping={CONST_FORUMS}
            />
            <CommentIcon
              count={analytics?.comment}
              onClick={expanded ? undefined : handleCommentClick}
              size={expanded ? 'lg' : 'sm'}
            />
            <CommentsIcon
              count={analytics?.privateComment}
              onClick={expanded ? undefined : handleCommentClick}
              size={expanded ? 'lg' : 'sm'}
            />
          </div>
        </CardFooter>
      )}
      {showComments && (
        <div className={clsx('mt-3')}>
          <CommentBox
            key={id}
            forumId={id}
            data={comments || []}
            loading={loadingComments}
            nextPage={nextCommentsPage}
            fetchComments={fetchComments}
            postComment={postComment}
            postCommentLoading={postCommentLoading}
            onEditSave={onEditSave}
            onDeleteFn={onDeleteFn}
            onMuteOrFollowFn={onMuteOrFollowFn}
            expanded={expanded}
            basePostAuthorProfileId={basePostAuthorProfileId}
          />
        </div>
      )}
    </>
  );
  return expanded ? forumContent : <Card feedsType={type}>{forumContent}</Card>;
}

function AuthorDetails({data, threeDotMenu, expanded}: AuthorDetailsProps) {
  const {
    author: {
      name,
      profileId,
      avatarUrl,
      badge,
      companyName,
      expertise,
      designation
    },
    datetime: {creationDate},
    type,
    postedTo
  } = data ?? {};

  return (
    <CardHeader
      feedsType={type}
      className={expanded ? classes.userDetails : 'w-100'}
    >
      <ProfileAvatarTooltip
        avatarUrl={avatarUrl ?? ''}
        badge={badge}
        id={profileId ?? 0}
        name={name ?? ''}
        imageHeight={expanded ? 80 : undefined}
        imageWidth={expanded ? 80 : undefined}
      />
      <div>
        <ForumTitle
          authorName={name ?? ''}
          profileId={profileId ?? 0}
          company={
            designation ? `${designation} of ${companyName}` : companyName ?? ''
          }
          postedTo={postedTo}
        />

        <DisplayDateTime creationDate={creationDate} />
        {expanded && !!expertise?.length && (
          <div className="cardTitleText">
            <span>Expertise in: </span>
            <span>{expertise.join(', ')}</span>
          </div>
        )}
      </div>
      {threeDotMenu}
    </CardHeader>
  );
}

function ThreeDotMenu({
  data,
  setEditData,
  setEditingPost,
  vertical = false,
  postFollow,
  forceClose = false,
  postMute,
  postDelete
}: ThreeDotMenuProps) {
  const userData = useSelector(selectUserInfo());
  return (
    <Popover
      mode="click"
      popover={
        <ForumMenuOverlay
          forumData={data}
          userData={userData}
          setEditData={setEditData}
          setEditingPost={setEditingPost}
          postFollow={postFollow}
          postMute={postMute}
          postDelete={postDelete}
        />
      }
      placement="bottom-end"
      hideOnBlur
      forceClose={forceClose}
      popoverClass="rounded-0"
    >
      <span className={clsx(['ms-auto h-100', vertical && 'fs-4'])}>
        {vertical ? <VerticalEllipsisIcon /> : <EllipsisIcon />}
      </span>
    </Popover>
  );
}
