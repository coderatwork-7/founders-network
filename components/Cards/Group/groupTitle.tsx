import {ProfileNameTooltip} from '@/components/ProfileTooltip';
import Link from 'next/link';
interface GroupTitleProps {
  authorName: string;
  groupName: string;
  profileId: number;
  groupId: string;
}
export default function GroupTitle({
  authorName,
  profileId,
  groupName,
  groupId
}: GroupTitleProps) {
  return (
    <div>
      <ProfileNameTooltip id={profileId} name={authorName} /> just joined the{' '}
      <Link href={`/group/${groupId}`}>{groupName}</Link>
    </div>
  );
}
