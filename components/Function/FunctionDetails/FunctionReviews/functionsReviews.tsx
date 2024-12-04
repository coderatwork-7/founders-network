import {
  ProfileAvatarTooltip,
  ProfileNameTooltip
} from '@/components/ProfileTooltip';
import Card from '@/ds/Card/card';
import styles from './functionReviews.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXTwitter} from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

interface AuthorType {
  name: string;
  avatar: string;
  profileId: number;
  companyName: string;
}

interface ReviewsTweetsType {
  author: AuthorType;
  text: string;
  link: string;
}

interface FunctionReviewPropsTypes {
  reviewsTweets: ReviewsTweetsType[];
}

export const FunctionReviews = ({reviewsTweets}: FunctionReviewPropsTypes) => {
  return (
    <Card className="text-start px-4 py-4">
      <div className="mb-5">
        <h5 className="fw-bold">Reviews</h5>
      </div>
      {reviewsTweets?.map((reviewMember: ReviewsTweetsType) => {
        const AuthorDetails: AuthorType = reviewMember?.author;
        return (
          <div
            key={AuthorDetails?.profileId}
            className="mb-4 d-flex justify-content-between"
          >
            <div className={styles.avatarContainer}>
              <ProfileAvatarTooltip
                name={AuthorDetails?.name}
                id={AuthorDetails?.profileId}
                avatarUrl={AuthorDetails?.avatar}
              />
              <div>
                <div>
                  <ProfileNameTooltip
                    name={AuthorDetails?.name}
                    id={AuthorDetails?.profileId}
                  />
                </div>
                <div>
                  <ProfileNameTooltip
                    name={AuthorDetails?.companyName}
                    id={AuthorDetails?.profileId}
                  />
                </div>
              </div>
            </div>
            <Card className={styles.tweetContainer}>
              <div className={styles.tweetText}>{reviewMember?.text}</div>
              <Link
                href={reviewMember?.link}
                target="_blank"
                className={styles.tweetIconContainer}
              >
                <FontAwesomeIcon
                  className={styles.tweetIcon}
                  icon={faXTwitter}
                />
                Tweet
              </Link>
            </Card>
          </div>
        );
      })}
    </Card>
  );
};
