import { useState } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import View from '../View';

export default function Container({
  onClose,
  onSave,
  checkedAppIdsMap
}) {
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues });
  };
  const queryGetter = () => query;

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
      queryGetter={queryGetter}
      querySetter={querySetter}
      source={{ // Fake source from useQuery return values;
        totalCount: () => applications.length,
        loaded: () => true,
        pending: () => false,
        failure: () => false,
        failureMessage: () => 'Something went wrong'
      }}
    />
  );
}

Container.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  checkedAppIdsMap: PropTypes.object
};


