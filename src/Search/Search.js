import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from '@folio/stripes/components';

import Modal from '../Modal';

const triggerId = 'find-application-trigger';
export default function ApplicationSearch(props) {
  const {
    renderTrigger
  } = props;

  const modalRef = useRef();
  const modalTrigger = useRef();

  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const renderDefaultTrigger = () => {
    return (
      <Button
        buttonRef={modalTrigger}
        buttonStyle="primary noRightRadius"
        data-testid="default-trigger"
        id={triggerId}
        onClick={openModal}
      >
        <Icon color="#fff" icon="search" />
      </Button>
    );
  };

  const renderTriggerButton = () => {
    return renderTrigger
      ? renderTrigger({
        id: triggerId,
        onClick: openModal,
        buttonRef: modalTrigger,
      })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTriggerButton()}
      <Modal
        modalRef={modalRef}
        onClose={closeModal}
        open={open}
        {...props}
      />
    </>
  );
}

ApplicationSearch.propTypes = {
  renderTrigger: PropTypes.func,
};

