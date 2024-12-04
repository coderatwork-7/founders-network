import {Modal} from 'react-bootstrap';
import {IntroRequestForm} from './introRequestForm';
import classes from './introRequestForm.module.scss';

interface IntroRequestModalProp {
  show: boolean;
  onHide: () => void;
  investorId: number;
}
const IntroRequestModal: React.FC<IntroRequestModalProp> = ({
  show,
  onHide,
  investorId
}) => (
  <Modal show={show} onHide={onHide} animation={true} centered fullscreen>
    <button
      className="btn-close mt-3 me-3 position-absolute end-0"
      onClick={onHide}
    />
    <Modal.Header className="flex-column">
      <h4 className={classes.greenColor}>Request an Introduction</h4>
      <h5 className={classes.verify}>
        Please verify and update the information we will send to our investors
      </h5>
    </Modal.Header>
    <Modal.Body>
      <IntroRequestForm investorId={investorId.toString()} />
    </Modal.Body>
  </Modal>
);
export {IntroRequestModal};
