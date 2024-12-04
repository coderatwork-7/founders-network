import {NAVLINKS} from '@/utils/common/constants';
import React from 'react';
import useChatModal from '@/hooks/useChatModal';

export const MessageUs: React.FC = () => {
  const openChatModal = useChatModal();

  return (
    <>
      <span
        onClick={
          () =>
            openChatModal({
              userId: 4598,
              name: 'Success Team',
              profileUrl: '/profile/4336',
              profileImage:
                'https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,f_jpg,h_400,r_4,w_400/g_south_east,l_fn_22_mw4cdy,r_0:0:4:0/v1/production/userprofile/6b046977f52f41dd4194d373724b9241.jpg',
              companyName: 'Founders Network'
            }) //TODO: Replace hardcoded value with API call.
        }
      >
        {NAVLINKS.contactUs.label}
      </span>
    </>
  );
};
