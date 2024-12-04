import {ConversationType} from '@/components/Chat';
import {
  ModalContext,
  ModalName
} from '@/components/ContextProviders/ModalContext';
import {useContext} from 'react';
import {toast} from 'react-toastify';

function useChatModal() {
  const {openModal} = useContext(ModalContext);

  return (user?: ConversationType) => {
    if (!user || user.userId) openModal(ModalName.Chat, {user});
    else
      toast.error(
        `Error opening ${
          user?.name?.split(' ')?.[0]
        }'s conversation. Try searching in Chat!`,
        {
          theme: 'dark'
        }
      );
  };
}

export default useChatModal;
