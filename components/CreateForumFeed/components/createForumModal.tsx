import clsx from 'clsx';
import {ChangeEvent, LegacyRef, useEffect} from 'react';
import {ModalBody, Spinner} from 'react-bootstrap';
import {Session} from 'next-auth';
import useIsMobile from '@/utils/common/useIsMobile';
import {Button, ButtonVariants} from '@/ds/Button';
import {KeywordInputFacet} from '@/ds/KeywordInputFacet';
import {Checkbox, CheckboxSize} from '@/ds/Checkbox';
import {DropdownItem} from '@/types/dropdown';
import {TextEditor} from './textEditor';
import {PreviewCard} from './previewCard';
import {KeepInMind} from './keepInMind';
import {ModerationInfoBar} from './moderationInfoBar';
import {ROLES} from '@/utils/common/constants';
import classes from '../createForumFeed.module.scss';
import {Modal} from '@/ds/Modal';
import {FacetState} from '@/utils/common/commonTypes';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';

interface CreateForumModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  showPreview: boolean;
  editorData: string;
  subject: string;
  postingTo: DropdownItem;
  user: Session['user'];
  handleEditorChange: (content: string, editor: any) => void;
  handleSubjectChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setPostingTo: React.Dispatch<React.SetStateAction<DropdownItem>>;
  subjectInputRef: LegacyRef<HTMLInputElement>;
  membersList: {[key: string]: DropdownItem};
  tagsList: {[key: string]: DropdownItem};
  selectedTags: FacetState;
  updateTags: (obj: FacetState, isMultiselect: boolean) => void;
  isAnonymous: boolean;
  handleIsAnonymousCheck: (event: ChangeEvent<HTMLInputElement>) => void;
  isModeration: boolean;
  handleIsModerationCheck: (event: ChangeEvent<HTMLInputElement>) => void;
  moderationComment: string;
  handleModCommentChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditClick: () => void;
  handlePreviewClick: () => void;
  handleSubmitClick: () => void;
  isValidated: boolean;
  validationMessage: string;
  mention: JSX.Element;
  setShowPlugin: React.Dispatch<React.SetStateAction<boolean>>;
  pluginPosition: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>;
}

export const CreateForumModal: React.FC<CreateForumModalProps> = ({
  showModal,
  handleCloseModal,
  showPreview,
  editorData,
  subject,
  postingTo,
  user,
  handleEditorChange,
  handleSubjectChange,
  setPostingTo,
  subjectInputRef,
  membersList,
  tagsList,
  selectedTags,
  updateTags,
  isAnonymous,
  handleIsAnonymousCheck,
  isModeration,
  handleIsModerationCheck,
  moderationComment,
  handleModCommentChange,
  handleEditClick,
  handlePreviewClick,
  handleSubmitClick,
  isValidated,
  validationMessage,
  mention,
  setShowPlugin,
  pluginPosition
}) => {
  const isMobile = useIsMobile();
  const loading = useSelector(selectApiState('postCreateForumPost'));
  const tagsEditor =
    membersList == undefined ? (
      <Spinner size="sm" />
    ) : (
      <KeywordInputFacet
        facetKey="inputTags"
        facetName="Post Tags"
        dropdownItems={tagsList}
        labelText="Add up to 3 tags:"
        limitTags={3}
        selectedItems={selectedTags}
        facetValueOnClick={updateTags}
        placeholderText="Add Tags"
        ignoredFacetKeys={{}}
      />
    );
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      fullscreen={true}
      enforceFocus={false}
    >
      <ModalBody className={classes['modal-body']}>
        <div
          className={clsx(
            'position-absolute',
            classes['close-btn'],
            isMobile && classes.mobile
          )}
        >
          <Button
            className="border-0 btn-close"
            variant={ButtonVariants.OutlineInfo}
            onClick={handleCloseModal}
          />
        </div>
        <div className={clsx('d-flex', 'w-100', isMobile ? 'py-4' : 'p-5')}>
          <div
            className={clsx(
              'w-100',
              'd-flex',
              'flex-column',
              classes.container,
              isMobile ? 'w-100' : 'mx-auto'
            )}
          >
            <h3 className="pb-2">Create a new post</h3>
            <div className="d-flex flex-row w-100 gap-4">
              <div
                className={clsx('w-100', !isMobile && classes['left-panel'])}
              >
                <div className="pb-3">
                  {(user?.role === ROLES.INVESTOR ||
                    user?.role === ROLES.PARTNER_LIMITED) && (
                    <ModerationInfoBar />
                  )}
                  {showPreview ? (
                    <PreviewCard
                      editorData={editorData}
                      subject={subject}
                      postedTo={postingTo}
                      userData={user}
                    />
                  ) : (
                    <div>
                      <TextEditor
                        value={editorData}
                        handleEditorChange={handleEditorChange}
                        handleSubjectChange={handleSubjectChange}
                        setPostingTo={setPostingTo}
                        postingTo={postingTo}
                        subject={subject}
                        dropdownData={membersList}
                        subjectInputRef={subjectInputRef}
                        mention={mention}
                      />
                      <div className="pt-3">{tagsEditor}</div>
                    </div>
                  )}
                </div>

                {!showPreview && (
                  <div
                    className={clsx(
                      'd-flex',
                      'flex-column',
                      'pb-3',
                      classes['checkbox-container']
                    )}
                  >
                    <div>
                      <Checkbox
                        size={
                          isMobile ? CheckboxSize.Large : CheckboxSize.Medium
                        }
                        checked={isModeration}
                        onChange={handleIsModerationCheck}
                      >
                        <span>
                          <b>Opt-in Moderation:</b> Our team will review your
                          post before it goes live
                        </span>
                      </Checkbox>
                    </div>
                    {isModeration && (
                      <textarea
                        className={classes['moderation-comment']}
                        placeholder="We’ll check your formatting, links, tags, distribution and adherence to our Forum Guidelines. Have a specific concern? Please share it with us here."
                        rows={4}
                        value={moderationComment}
                        onChange={handleModCommentChange}
                      ></textarea>
                    )}
                    <div>
                      <Checkbox
                        size={
                          isMobile ? CheckboxSize.Large : CheckboxSize.Medium
                        }
                        checked={isAnonymous}
                        onChange={handleIsAnonymousCheck}
                      >
                        <span>Post anonymously</span>
                      </Checkbox>
                    </div>
                    <a
                      href="/guidelines/#anon"
                      className={clsx('link-primary', 'me-auto')}
                      target="_blank"
                    >
                      How does this work?
                    </a>
                  </div>
                )}

                <div
                  className={clsx(
                    'd-flex',
                    classes['form-buttons'],
                    !isMobile && 'align-items-center',
                    isMobile && 'flex-column'
                  )}
                >
                  {showPreview ? (
                    <Button
                      variant={ButtonVariants.OutlineSecondary}
                      onClick={handleEditClick}
                    >
                      EDIT POST
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={ButtonVariants.OutlineSecondary}
                        onClick={handlePreviewClick}
                      >
                        PREVIEW
                      </Button>
                      <Button
                        variant={ButtonVariants.Primary}
                        onClick={handleSubmitClick}
                        loading={loading}
                        loadingChildren="SUBMITTING"
                        disabled={loading}
                      >
                        SUBMIT POST
                      </Button>
                      {!isValidated && (
                        <div>
                          <span className="text-danger">
                            {validationMessage || 'Content cannot be empty'}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {!isMobile && (
                <div className={clsx(classes['right-panel'])}>
                  <KeepInMind />
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
