import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from '@folio/stripes/components';

import { Container } from '../Container';

import css from './Modal.css';

export default function ApplicationSearchModal(props) {
  const {
    modalRef,
    onClose,
    open,
    onSave,
    checkedAppIdsMap
  } = props;
  const backupModalRef = useRef();
  const theModalRef = modalRef || backupModalRef;

  return (
    <Modal
      ref={theModalRef}
      contentClass={css.modalContent}
      dismissible
      enforceFocus={false}
      id="find-application"
      label={<FormattedMessage id="ui-plugin-select-application.selectApplication" />}
      onClose={onClose}
      open={open}
      size="large"
    >
      <Container
        checkedAppIdsMap={checkedAppIdsMap}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>

  );
}

ApplicationSearchModal.propTypes = {
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }),
  onSave: PropTypes.func,
  checkedAppIdsMap: PropTypes.object
};

