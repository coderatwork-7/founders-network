import {Button, ButtonVariants} from '@/ds/Button';
import {useState} from 'react';
import {AddDealModal} from './AddDealModal';

export function AddDeal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      {showModal && <AddDealModal setShowModal={setShowModal} />}
      <Button
        variant={ButtonVariants.Primary}
        onClick={() => setShowModal(true)}
      >
        ADD DEAL
      </Button>
    </>
  );
}
