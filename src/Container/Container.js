import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import View from '../View';

export default function Container({
  onClose,
  onSave,
  checkedAppIdsMap
}) {
  const stripes = useStripes();

  const applications = Object.values(stripes.discovery.applications).map(app => ({ id: app.name, name: app.name }));

  return (
    <View
      checkedAppIdsMap={checkedAppIdsMap}
      data={{
        applications,
      }}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

Container.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  checkedAppIdsMap: PropTypes.object
};


