import classes from './libraryItemPage.module.scss';
import {LibraryItem} from '../LibraryPage/libraryPage';
import {useState} from 'react';
import Image from 'next/image';
import Parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import {replaceAnchorTag} from '@/utils/common/help';
import {MentionedPost} from './MentionedPost/mentionedPost';

interface LibraryItemPageProps {
  data: LibraryItem | null;
  mentionedPosts?: any[] | null;
}

export const LibraryItemPage: React.FC<LibraryItemPageProps> = ({
  data,
  mentionedPosts
}) => {
  const [showCoverImage, setShowCoverImage] = useState(true);

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        Error getting data
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={classes.coverImgContainer}>
          {showCoverImage && data.coverImageUrl && (
            <Image
              alt="Cover Image"
              src={data.coverImageUrl}
              fill
              className={classes.coverImg}
              onError={() => setShowCoverImage(false)}
            />
          )}
        </div>
        <div className={classes.heading}>
          <div className={classes.title}>{data.title}</div>
          <div className={classes.subtitle}>{data.subtitle}</div>
        </div>
      </div>

      {!!data.details?.length && (
        <article className={classes.details}>
          {Parse(
            DOMPurify.sanitize(data.details ?? '', {
              ADD_TAGS: ['iframe'],
              ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
            }),
            {replace: replaceAnchorTag}
          )}
        </article>
      )}

      {!!mentionedPosts?.length && (
        <>
          <div className={classes.mentionLabel}>
            Mentioned Posts from the Network
          </div>
          <div className={classes.mentionedPosts}>
            {mentionedPosts.map(post => (
              <MentionedPost key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
