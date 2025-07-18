import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import View from '../View';
import { useApplications } from '../hooks/useApplications';

const INITIAL_RESULT_COUNT = 0;

export default function Container({
  onClose,
  onSave,
  checkedAppIdsMap
}) {
  const stripes = useStripes();
  const applicationsList = Object.values(stripes.discovery.applications).map(app => ({ id: app.name, name: app.name }));
  //const { applications, isLoading, onSubmitSearch } = useApplications();
  const [applications, setApplications] = useState(applicationsList);
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    let filteredApplications = applicationsList;

    if (nsValues.filters === 'status.selected') {
      filteredApplications = filteredApplications.filter(app => app.id in checkedAppIdsMap);
    }

    if (nsValues.filters === 'status.unselected') {
      filteredApplications = filteredApplications.filter(app => !(app.id in checkedAppIdsMap));
    }

    if (nsValues.query) {
        filteredApplications = filteredApplications.filter(app => app.id.includes(nsValues.query));
    }

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
      onClose={onClose}
      onSave={onSave}
      initialSearch={''}
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


