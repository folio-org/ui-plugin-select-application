import { useState } from 'react';
import PropTypes from 'prop-types';

import View from '../View';

import mockApplications from './mockApplications';

export default function Container({
  onClose
}) {
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues });
  };
  const queryGetter = () => query;
  const {
    applications = [],
    total: applicationsCount = 0
  } = {
    total: mockApplications.length,
    applications: mockApplications,
  };

  return (
    <View
      data={{
        applications,
      }}
      onClose={onClose}
      queryGetter={queryGetter}
      querySetter={querySetter}
      source={{ // Fake source from useQuery return values;
        totalCount: () => applicationsCount,
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
};


