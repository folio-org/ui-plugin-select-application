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
    const filteredApplications = filterApplications(applicationsList, checkedAppIdsMap, nsValues.filters, nsValues.query);

    setApplications(filteredApplications);
    setQuery({ ...query, ...nsValues });
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
