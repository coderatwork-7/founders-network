import Card from '@/ds/Card/card';
import classes from './testimonialCard.module.scss';
import Avatar from '@/ds/Avatar/avatar';

interface TestimonialCardPropsType {
  avatarUrl: string;
  badge?: string;
  authorName: string;
  authorDetails?: string;
  quote: string;
}

const BadgeMapping = {
  seriesa: 'Series-A+',
  lifetime: 'Lifetime',
  angel: 'Angel',
  bootstrap: 'Bootstrap'
};

export const TestimonialCard = ({
  avatarUrl,
  authorName,
  authorDetails,
  quote,
  badge
}: TestimonialCardPropsType) => {
  return (
    <Card className={classes['testimonialContainer']}>
      {avatarUrl && (
        <Avatar
          size="xx-lg"
          imageHeight={130}
          imageWidth={130}
          imgContainerStyles={classes['imageContainerStyles']}
          badge={(BadgeMapping as Record<string, string>)[badge ?? 'bootstrap']}
          badgeHeight={24}
          badgeWidth={24}
          avatarUrl={avatarUrl}
          altText="avatar"
        />
      )}
      <div className={classes['quoteContainer']}>
        <div className={classes['quote']}>{quote}</div>
        <div className={classes['quoteAuthor']}>
          {authorName}, {authorDetails}
        </div>
      </div>
    </Card>
  );
};
