import {TYPE_FORUMS} from '@/utils/common/commonTypes';
import {Session} from 'next-auth';
import ForumCard, {ForumCardProps} from '@/components/Cards/Forum/forumCard';
import {DropdownItem} from '@/types/dropdown';

const currentDate = new Date();
const creationDate = currentDate.toISOString();

export const PreviewCard = ({
  editorData,
  subject,
  userData,
  postedTo
}: {
  editorData: string;
  subject: string;
  userData: Session['user'];
  postedTo?: string | DropdownItem;
}) => {
  const type: TYPE_FORUMS = 'forums';

  const data: ForumCardProps = {
    data: {
      id: 'preview-card',
      threadId: 'preview-card',
      author: {
        profileId: userData.id,
        name: userData?.name,
        avatarUrl: userData.avatarUrl,
        companyName: userData.company_name
      },
      datetime: {
        creationDate
      },
      title: subject,
      type,
      detail: {
        content: editorData
      },
      showOptions: false,
      postedTo
    }
  };

  return <ForumCard data={data.data} />;
};
