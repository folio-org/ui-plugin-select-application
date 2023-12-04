import { MemoryRouter } from 'react-router-dom';

import {
  Accordion,
  Checkbox,
  renderWithIntl,
  translationsProperties,
} from '@folio/stripes-erm-testing';
import Filters from './Filters';


const activeFilters = {
  'status': [
    'selected',
    'unselected'
  ]
};

const stateMock = jest.fn();

const filterHandlers = {
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
  state: stateMock
};

describe('Filters', () => {
  // eslint-disable-next-line no-unused-vars
  let renderComponent;

  beforeEach(() => {
    renderComponent = renderWithIntl(<MemoryRouter><Filters activeFilters={activeFilters} filterHandlers={filterHandlers} /></MemoryRouter>, translationsProperties);
  });

  test('renders the Status Accordion', async () => {
    await Accordion('Application selection status').is({ open: true });
  });

  it('renders Status Checkboxs', async () => {
    await Checkbox({ id: 'clickable-filter-status-selected' }).exists();
    await Checkbox({ id: 'clickable-filter-status-unselected' }).exists();
  });
});
