import Parse from 'html-react-parser';
import {ModalBody} from 'react-bootstrap';
import {Modal} from '@/ds/Modal';
import useIsMobile from '@/utils/common/useIsMobile';
import clsx from 'clsx';

import classes from './videoModal.module.scss';

/**
 * Video Modal Component. Injects iframe inside to load video.
 * @param {videoLink: string, showModal: boolean, handleCloseModal: function}
 * @returns React Functional Component
 */
export const VideoModal: React.FC<{
  showModal: boolean;
  videoLink?: string;
  handleCloseModal?: () => void;
  imageSrc?: string;
  link?: string;
}> = ({videoLink, showModal, handleCloseModal, imageSrc, link}) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      onHide={handleCloseModal}
      centered
      show={showModal}
      dialogClassName={clsx(classes.modal, isMobile && classes.mobile)}
      contentClassName={clsx(classes.modal, isMobile && classes.mobile)}
    >
      <ModalBody className="p-0">
        {videoLink ? (
          Parse(videoLink)
        ) : (
          <>
            <button
              className="btn-close mt-3 me-3 position-absolute end-0"
              onClick={handleCloseModal}
            />
            <div className="d-flex align-items-center justify-content-center h-100">
              {link ? (
                <a target="_blank" href={link}>
                  View Pitch Deck
                </a>
              ) : imageSrc ? (
                <img className={classes.image} src={imageSrc}></img>
              ) : (
                <p>Nothing to show</p>
              )}
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};
