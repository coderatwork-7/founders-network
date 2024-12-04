import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAllMembers,
  selectAllTags,
  selectCacheData,
  selectUserInfo
} from '@/store/selectors';
import {DropdownItem} from '@/types/dropdown';
import {CreateForumModal} from './components/createForumModal';
import {CreatePostButton} from './components/createPostButton';
import {ROLES} from '@/utils/common/constants';
import {ResponseModal} from './components/responseModal';
import {FacetState} from '@/utils/common/commonTypes';
import {useFacetState} from '../Common/Facets/useFacetState';
import {toast} from 'react-toastify';
import {CacheType, cacheData} from '@/store/reducers/userSlice';
import {
  getMentionedArray,
  isObjectEmpty,
  placeMentionPlugin
} from '@/utils/common/helper';
import {useMentionPlugin} from '@/hooks/useMentionPlugin';
import {Mention} from '@/components/Mention';

const POSTING_TO_DEFAULT = 'forum';

function processFacetObject(obj: FacetState) {
  const array: string[] = [];
  Object.keys(obj ?? {}).forEach(facetKey => {
    Object.values(obj[facetKey])?.forEach?.(element => {
      array.push(element.facetValueKey);
    });
  });
  return array;
}

function getDefaultForumMember(members: {[key: string]: DropdownItem}) {
  const keys = Object.keys(members ?? {});
  return members?.[
    keys?.find?.(
      key => members?.[key]?.name?.toLowerCase?.() === POSTING_TO_DEFAULT
    ) ?? keys?.[0]
  ];
}

export const CreateForumFeed = ({
  groupEmail,
  groupDisplayName
}: {
  groupEmail?: string;
  groupDisplayName?: string;
}) => {
  const preSavedData = useSelector(selectCacheData(CacheType.newForumPost));
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editorData, setEditorData] = useState<string>(
    preSavedData?.content ?? ''
  );
  const [postingTo, setPostingTo] = useState<DropdownItem>(
    groupEmail
      ? {
          id: groupEmail,
          name: groupDisplayName ?? groupEmail
        }
      : ({} as DropdownItem)
  );
  const [subject, setSubject] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isModeration, setIsModeration] = useState<boolean>(false);
  const [moderationComment, setModerationComment] = useState<string>('');
  const {
    selectedFacetValues: selectedTags,
    updateFacetValue: updateTags,
    setSelectedFacetValues: setSelectedTags
  } = useFacetState();
  const [isValidated, setIsValidated] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const {
    pluginPosition,
    setShow: setShowMention,
    show,
    mentionString,
    editor: editorRef
  } = useMentionPlugin();

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo());

  const api = useAPI();

  const tagsList: {[key: string]: DropdownItem} = useSelector(selectAllTags());
  const memoizedTagsList = useMemo(() => tagsList, [tagsList]);
  const groupMembersList: {[key: string]: DropdownItem} = useMemo(
    () =>
      groupEmail
        ? {
            [groupEmail]: {id: groupEmail, name: groupDisplayName ?? groupEmail}
          }
        : {},
    [groupEmail]
  );
  const membersList: {[key: string]: DropdownItem} = useSelector(
    selectAllMembers()
  );
  const memoizedMembersList = useMemo(() => membersList, [membersList]);

  const fetchMembersData = useCallback(async () => {
    await api('getForumMembers', {
      isReduxSkipped: false
    });
  }, [api]);

  const fetchTagsData = useCallback(async () => {
    await api('getForumTags', {
      isReduxSkipped: false
    });
  }, [api]);

  const postForumData = useCallback(
    (data: any) => {
      api('postCreateForumPost', {}, {method: 'POST', data})
        .then(res => {
          resetAllState(true);
          setShowModal(false);
          if (res?.data?.post?.inModeration) {
            setShowResponseModal(true);
          } else {
            toast.success('Forum Post Created Successfully!', {
              theme: 'dark',
              delay: 200
            });
          }
        })
        .catch(e => {
          setIsValidated(false);
          setValidationMessage('Error Creating Post');
        });
    },
    [api]
  );

  const fetchTagsAndMembersData = useCallback(async () => {
    await Promise.all([
      tagsList ? Promise.resolve() : fetchTagsData(),
      groupEmail ? Promise.resolve() : fetchMembersData()
    ]);
  }, [fetchTagsData, fetchMembersData, groupEmail]);

  useEffect(() => {
    if (userInfo?.id && (!tagsList || (!groupEmail && !membersList)))
      setTimeout(fetchTagsAndMembersData, 500);
  }, [userInfo?.id]);

  useEffect(() => {
    if (showModal) {
      if (groupEmail !== preSavedData?.lastOpenedGroup) {
        if (!groupEmail) setPostingTo(getDefaultForumMember(membersList));
        return;
      }
      if (membersList) setPostingTo(getDefaultForumMember(membersList));
      if (preSavedData) {
        setPostingTo(preSavedData.postingTo);
        setSubject(preSavedData.subject);
        setEditorData(preSavedData.editorData);
        setSelectedTags(preSavedData.selectedTags);
        setIsAnonymous(preSavedData.isAnonymous);
        setIsModeration(preSavedData.isModeration);
        setModerationComment(preSavedData.moderationComment);
      }
    }
  }, [membersList, showModal]);

  useEffect(() => {
    groupEmail &&
      setPostingTo({
        id: groupEmail ?? '',
        name: groupDisplayName ?? groupEmail ?? ''
      });
  }, [groupEmail, groupDisplayName]);

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, [groupEmail]);

  const handleCloseModal = useCallback(() => {
    dispatch(
      cacheData({
        [CacheType.newForumPost]: {
          postingTo,
          subject,
          editorData,
          selectedTags,
          isAnonymous,
          isModeration,
          moderationComment,
          lastOpenedGroup: groupEmail
        }
      })
    );
    resetAllState();
    setShowModal(false);
  }, [
    postingTo,
    subject,
    editorData,
    selectedTags,
    isAnonymous,
    isModeration,
    moderationComment
  ]);

  const handleCloseResponseModal = useCallback(() => {
    setShowResponseModal(false);
  }, []);

  const handleEditorChange = useCallback((content: string, editor: any) => {
    placeMentionPlugin(
      editor,
      setShowMention,
      pluginPosition,
      mentionString,
      editorRef
    );
    setEditorData(content);
    setIsValidated(true);
  }, []);

  const handleSubjectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event?.target?.setCustomValidity('');
      setSubject(event.target?.value);
    },
    []
  );

  const handleIsAnonymousCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setIsAnonymous(event.currentTarget?.checked),
    []
  );

  const handleIsModerationCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setIsModeration(event.currentTarget?.checked),
    []
  );

  const handleModCommentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) =>
      setModerationComment(event.target?.value),
    []
  );

  const handlePreviewClick = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleEditClick = useCallback(() => {
    setShowPreview(false);
  }, []);

  const resetAllState = (clearCache: boolean = false) => {
    setEditorData('');
    setSubject('');
    setIsAnonymous(false);
    setIsModeration(false);
    setSelectedTags({});
    setIsValidated(true);
    setValidationMessage('');
    setModerationComment('');

    if (clearCache) {
      dispatch(
        cacheData({
          [CacheType.newForumPost]: null
        })
      );
    }
  };

  const handleSubmitClick = useCallback(() => {
    setValidationMessage('');
    if (subjectInputRef.current) {
      subjectInputRef.current?.setCustomValidity(
        subject?.trim() === '' ? 'Please enter a subject.' : ''
      );
      subjectInputRef.current?.reportValidity();
    }

    if (editorData?.trim?.() === '') {
      setIsValidated(false);
    } else {
      setIsValidated(true);
    }

    if (
      !subjectInputRef?.current?.checkValidity() ||
      editorData?.trim() === ''
    ) {
      return;
    }

    const mentioned: string[] = getMentionedArray(editorData);

    postForumData({
      postingTo: groupEmail ?? postingTo.emailId,
      topic: subject,
      content: editorData,
      mentioned,
      tags: processFacetObject(selectedTags),
      isAnonymous,
      optinModeration: isModeration,
      moderationComment:
        isModeration && moderationComment ? moderationComment : ''
    });
  }, [
    postingTo,
    subject,
    editorData,
    selectedTags,
    isAnonymous,
    isModeration,
    moderationComment
  ]);

  const isNotAllowedRole =
    userInfo?.role !== ROLES.PARTNER_LIMITED &&
    userInfo?.role !== ROLES.INVESTOR;
  const mention =
    show && pluginPosition.current ? (
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
          setEditorData={setEditorData}
          setShow={setShowMention}
          pluginPosition={pluginPosition}
        />
      </div>
    ) : (
      <></>
    );
  return (
    <>
      {isNotAllowedRole && (
        <>
          <CreatePostButton handleOpenModal={handleOpenModal} />
          <CreateForumModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            showPreview={showPreview}
            editorData={editorData}
            subject={subject}
            subjectInputRef={subjectInputRef}
            postingTo={postingTo}
            user={userInfo}
            handleEditorChange={handleEditorChange}
            handleSubjectChange={handleSubjectChange}
            setPostingTo={setPostingTo}
            membersList={
              isObjectEmpty(groupMembersList)
                ? memoizedMembersList
                : groupMembersList
            }
            tagsList={memoizedTagsList}
            selectedTags={selectedTags}
            updateTags={updateTags}
            isAnonymous={isAnonymous}
            handleIsAnonymousCheck={handleIsAnonymousCheck}
            isModeration={isModeration}
            moderationComment={moderationComment}
            handleModCommentChange={handleModCommentChange}
            handleIsModerationCheck={handleIsModerationCheck}
            handleEditClick={handleEditClick}
            handlePreviewClick={handlePreviewClick}
            handleSubmitClick={handleSubmitClick}
            isValidated={isValidated}
            validationMessage={validationMessage}
            mention={mention}
            setShowPlugin={setShowMention}
            pluginPosition={pluginPosition}
          />
          {showResponseModal && (
            <ResponseModal
              showModal={showResponseModal}
              handleCloseModal={handleCloseResponseModal}
            />
          )}
        </>
      )}
    </>
  );
};
