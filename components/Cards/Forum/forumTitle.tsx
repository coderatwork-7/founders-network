import Link from 'next/link';
import {DropdownItem} from '@/types/dropdown';
import {ProfileNameTooltip} from '@/components/ProfileTooltip';
interface DealTitleProps {
  authorName: string;
  company?: string;
  profileId: number;
  postedTo?: string | DropdownItem;
}
export default function ForumTitle({
  authorName,
  company,
  postedTo,
  profileId
}: DealTitleProps) {
  let postedToText: string | JSX.Element = '';

  if (typeof postedTo === 'string') {
    postedToText = postedTo;
  } else if (postedTo) {
    postedToText = <Link href={`/group/${postedTo.id}`}>{postedTo.name}</Link>;
  }

  return (
    <>
      <ProfileNameTooltip
        id={profileId}
        name={`${authorName} ${company ? ' | ' + company : ''}`}
      />
      {!!postedTo && (
        <>
          <br />
          <span className="cardTitleText">Posted to the {postedToText}</span>
          <br />
        </>
      )}
    </>
  );
}
