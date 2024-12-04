import {ProfileNameTooltip} from '@/components/ProfileTooltip';

interface MemberTitleProps {
  authorName: string;
  nominated: string;
  profileId: number;
}
export default function MemberTitle({
  authorName,
  profileId,
  nominated
}: MemberTitleProps) {
  return (
    <>
      <ProfileNameTooltip id={profileId} name={authorName} /> just nominated{' '}
      {nominated} to join us.
      <br />
    </>
  );
}
