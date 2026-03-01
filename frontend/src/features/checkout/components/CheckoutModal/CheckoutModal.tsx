import { Modal } from '../../../../shared/ui/Modal';
import { CardForm } from '../CardForm';
import { DeliveryForm } from '../DeliveryForm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToSummary: () => void;
}

export function CheckoutModal({ isOpen, onClose, onProceedToSummary }: CheckoutModalProps) {
  // TODO: connect to Redux dispatch for saveCardData and saveDeliveryAddress
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment information">
      <CardForm onSubmit={() => {}} />
      <DeliveryForm onSubmit={() => { onProceedToSummary(); }} />
    </Modal>
  );
}
