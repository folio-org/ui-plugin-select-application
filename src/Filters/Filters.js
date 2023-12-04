import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionSet, FilterAccordionHeader } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const FILTERS_DATA_OPTIONS = {
  status: [{ value: 'selected', label:'Selected' },
    { value: 'unselected', label:'Unselected' }
  ],
};

export default function Filters({ activeFilters, filterHandlers }) {
  const renderCheckboxFilter = (name, props) => {
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label="Application selection status"
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
      {renderCheckboxFilter('status')}
    </AccordionSet>
  );
}

Filters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired
  }),
};

Filters.defaultProps = {
  activeFilters: {
    status: [],
  }
};

