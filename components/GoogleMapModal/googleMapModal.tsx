import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {Modal} from 'react-bootstrap';
import {GoogleMap} from './GoogleMap/googleMap';
import classes from './googleMapModal.module.scss';
import {useState} from 'react';

export enum MapError {
  'success',
  'failure',
  'showMap'
}

export const GoogleMapModal = ({
  setShowModal,
  address
}: {
  setShowModal: any;
  address?: string;
}) => {
  const handleClose = () => {
    setShowModal(false);
  };
  const [mapError, setMapError] = useState(MapError.showMap);
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <Modal
      show={true}
      onHide={handleClose}
      centered={!isMobile}
      fullscreen={isMobile ? true : undefined}
    >
      <Modal.Header closeButton className={classes.header}>
        Function
      </Modal.Header>
      <Modal.Body className={classes.content}>
        {MapError.showMap === mapError && (
          <GoogleMap address={address} setMapError={setMapError} />
        )}

        {MapError.failure === mapError && (
          <div className="text-center my-5">Error while Loading Google Map</div>
        )}
      </Modal.Body>
    </Modal>
  );
};
