import React, {createContext, useCallback, useMemo, useState} from 'react';
import {ChatModal} from '../Chat';
import {RequestIntroModal} from '../RequestIntro/requestIntroModal';
import useIsMobile from '@/utils/common/useIsMobile';
import {FeedbackModal} from '../FeedbackBanner/FeedbackModal/feedbackModal';
import {ConfirmDeleteModal} from '../Library/ConfirmDeleteModal/confirmDeleteModal';

interface ModalContextInterface {
  openModal: (modalName: ModalName, props?: any) => void;
}

export const ModalContext = createContext<ModalContextInterface>({
  openModal: () => {}
});

export enum ModalName {
  None,
  Chat,
  RequestIntro,
  Feedback,
  DeleteLibraryItem
}

const MODALS_MAP: {[key in ModalName]: React.FC<any>} = {
  [ModalName.None]: React.Fragment,
  [ModalName.Chat]: ChatModal,
  [ModalName.RequestIntro]: RequestIntroModal,
  [ModalName.Feedback]: FeedbackModal,
  [ModalName.DeleteLibraryItem]: ConfirmDeleteModal
};

export const ModalProvider = ({children}: any) => {
  const [modal, setModal] = useState(ModalName.None);
  const [props, setProps] = useState<any>(null);
  const SelectedModal = MODALS_MAP[modal];
  const isMobile = useIsMobile();

  const openModal = useCallback((modalName: ModalName, props: any) => {
    setModal(modalName);
    setProps(props);
  }, []);

  const handleCloseModal = () => {
    props?.handleCloseModal?.();
    setModal(ModalName.None);
  };

  const contextValue = useMemo(
    () => ({
      openModal
    }),
    []
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modal !== ModalName.None ? (
        <SelectedModal
          {...props}
          handleCloseModal={handleCloseModal}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </ModalContext.Provider>
  );
};
