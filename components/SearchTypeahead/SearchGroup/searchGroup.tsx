import Link from 'next/link';
import {SearchItem} from '../SearchItem';
import classes from './searchGroup.module.scss';

interface SearchGroupProps {
  items: any;
  type: GroupType;
  searchTerm: string;
}

enum GroupType {
  forum = 'forum',
  partners = 'partners',
  members = 'members',
  functions = 'functions',
  deals = 'deals',
  library = 'library'
}

const typeToLabelMap = {
  [GroupType.forum]: 'Forum Posts',
  [GroupType.partners]: 'Partners',
  [GroupType.members]: 'Members',
  [GroupType.functions]: 'Function',
  [GroupType.deals]: 'Deals',
  [GroupType.library]: 'Library'
};

export const typeToURLMap: {[key: string]: string} = {
  [GroupType.forum]: '/forum/?q=',
  [GroupType.partners]: '/partners/?q=',
  [GroupType.members]: '/members/?q=',
  [GroupType.functions]: '/function/all/?q=',
  [GroupType.deals]: '/deals/?q=',
  [GroupType.library]: '/library/#/search/'
};

const getPropsByType = (type: GroupType, item: any) => {
  switch (type) {
    case GroupType.forum:
      return {
        title: `${item.topic} By ${item.poster}`,
        sub1: item.date,
        sub2: `${item.replies} ${item.replies === 1 ? 'Reply' : 'Replies'}`
      };

    case GroupType.partners:
    case GroupType.members:
      return {
        title: item.name,
        img: item.profile_image,
        sub1: item.title__company,
        sub2: item.city
      };

    case GroupType.functions:
      return {
        title: item.title,
        sub1: item.city,
        sub2: item.date
      };

    case GroupType.deals:
      return {
        title: item.title,
        sub1: `${Math.round(item.rating * 10) / 10} Out Of 5 Stars`,
        sub2: item.type
      };

    case GroupType.library:
      return {
        title: item.title
      };

    default:
      return {
        title: '',
        sub1: '',
        sub2: ''
      };
  }
};

export function SearchGroup({
  items,
  type,
  searchTerm
}: SearchGroupProps): JSX.Element {
  return (
    <div className="text-left">
      <div className={classes.groupTitle}>{typeToLabelMap[type]}</div>
      <ul>
        {Array.isArray(items) &&
          items?.map((item: any) => (
            <SearchItem
              key={item.id}
              url={item.url}
              {...getPropsByType(type, item)}
            />
          ))}
      </ul>
      <Link
        href={typeToURLMap[type] + searchTerm.trim()}
        className={classes.groupLink}
      >
        {`See all ${typeToLabelMap[type]?.toLowerCase()} results`}
      </Link>
    </div>
  );
}
