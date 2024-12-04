import React, {useState} from 'react';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {FileUpload} from '@/ds/FileUpload';
import {Spinner} from '@/ds/Spinner';
import useIsMobile from '@/utils/common/useIsMobile';

interface CommentsFooterProps {
  commentBoxText: string;
  id: string;
  postComment: (
    type: string,
    files: File[],
    comment: string,
    setCommentBoxText: React.Dispatch<React.SetStateAction<string>>,
    basePostAuthorProfileId: number
  ) => Promise<any>;
  loading: boolean;
  setCommentBoxText: React.Dispatch<React.SetStateAction<string>>;
  basePostAuthorProfileId: number;
}
export const CommentsFooter: React.FC<CommentsFooterProps> = ({
  commentBoxText,
  id,
  postComment,
  loading,
  setCommentBoxText,
  basePostAuthorProfileId
}: CommentsFooterProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        'd-flex justify-content-between align-items-center',
        isMobile && files.length && 'flex-column'
      )}
    >
      <FileUpload
        files={files}
        setFiles={setFiles}
        id={`CommentFileUploadForForumId${id}`}
        name={`CommentFileUploadForForumId${id}`}
      />

      <div className="d-flex gap-2">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Button
              variant={ButtonVariants.OutlinePrimary}
              size="sm"
              className="text-nowrap"
              onClick={() =>
                postComment(
                  'reply',
                  files,
                  commentBoxText,
                  setCommentBoxText,
                  basePostAuthorProfileId
                )
              }
            >
              Private Reply
            </Button>
            <Button
              variant={ButtonVariants.Primary}
              size="sm"
              className="text-nowrap"
              onClick={() =>
                postComment(
                  'replyall',
                  files,
                  commentBoxText,
                  setCommentBoxText,
                  basePostAuthorProfileId
                )
              }
            >
              Post Reply
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
