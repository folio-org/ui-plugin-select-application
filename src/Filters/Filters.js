import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

export default function Filters({ activeFilters, filterHandlers }) {
  const intl = useIntl();

  const FILTERS_DATA_OPTIONS = {
    selection: [
      { value: 'selected', label: intl.formatMessage({ id: 'ui-plugin-select-application.selected' }) },
      { value: 'unselected', label: intl.formatMessage({ id: 'ui-plugin-select-application.unselected' }) },
    ],
    status: [
      { value: 'assigned', label: intl.formatMessage({ id: 'ui-plugin-select-application.assigned' }) },
      { value: 'unassigned', label: intl.formatMessage({ id: 'ui-plugin-select-application.unassigned' }) },
    ],
  };

  const FILTER_LABELS = {
    selection: intl.formatMessage({ id: 'ui-plugin-select-application.filter.selection' }),
    status: intl.formatMessage({ id: 'ui-plugin-select-application.filter.status' }),
  };

  const renderCheckboxFilter = (name, props) => {
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={FILTER_LABELS[name]}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={FILTERS_DATA_OPTIONS[name]}
          name={name}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('selection')}
      {renderCheckboxFilter('status')}
    </AccordionSet>
  );
}

Filters.propTypes = {
  activeFilters: PropTypes.shape({
    selection: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string)
  }),
  data: PropTypes.shape({
    applications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }))
  }).isRequired,
  filterHandlers: PropTypes.shape({
    clearGroup: PropTypes.func,
    state: PropTypes.func
  }),
};

Filters.defaultProps = {
  activeFilters: {
    selection: [],
    status: [],
  }
};
