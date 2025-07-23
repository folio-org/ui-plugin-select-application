import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import View from '../View';

const SELECTED_STATUS = 'status.selected';
const UNSELECTED_STATUS = 'status.unselected';

export const filterApplications = (applications, checkedAppIdsMap, filter, query) => {
  if (filter === SELECTED_STATUS) {
    return applications.filter(app => app.id in checkedAppIdsMap);
  }

  if (filter === UNSELECTED_STATUS) {
    return applications.filter(app => !(app.id in checkedAppIdsMap));
  }

  if (query) {
    return applications.filter(app => app.id.includes(query));
  }
  return applications;
};

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
  checkedAppIdsMap: PropTypes.object
};

module.exports = {
  Container,
  filterApplications
};
