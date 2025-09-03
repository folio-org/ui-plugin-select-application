import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import View from '../View';
import { filterApplications } from '../Utils';

export default function Container({
  onClose,
  onSave,
  checkedAppIdsMap
}) {
  const stripes = useStripes();
  const applicationsList = Object.values(stripes.discovery.applications).map(app => ({ id: app.name, name: app.name }));
  const [applications, setApplications] = useState(applicationsList);
  const [query, setQuery] = useState({});

  const querySetter = ({ nsValues }) => {
    const currentQuery = { ...query, ...nsValues };

    // Query and filters don't work the same way. An omitted query means reset search or filters only.
    // Omitted filters can occur when only search term is updated (but filters were previously applied).
    if (!nsValues.query) { currentQuery.query = undefined; }

    const filteredApplications = filterApplications(applicationsList, checkedAppIdsMap, currentQuery.filters, currentQuery.query);

    setApplications(filteredApplications);
    setQuery(currentQuery);
  };
  const queryGetter = () => query;

  return (
    <View
      checkedAppIdsMap={checkedAppIdsMap}
      data={{
        applications
      }}
      initialSearch=""
      onClose={onClose}
      onSave={onSave}
      queryGetter={queryGetter}
      querySetter={querySetter}
    />
  );
}

Container.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  checkedAppIdsMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.bool
  })
};
