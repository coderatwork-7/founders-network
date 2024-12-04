import {
  ModalContext,
  ModalName
} from '@/components/ContextProviders/ModalContext';
import {useContext} from 'react';

export type IntroProfileInfo = {
  profileId: string;
  firstName: string;
  lastName: string;
  role: string;
};
function useIntroModal() {
  const {openModal} = useContext(ModalContext);

  return (info: IntroProfileInfo) => {
    openModal(ModalName.RequestIntro, {profileInfo: info});
  };
}

export default useIntroModal;
