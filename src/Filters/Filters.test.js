import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

import {
  Accordion,
  Checkbox,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
import translationsProperties from '../../test/helpers';
import Filters from './Filters';


const activeFilters = {
  selection: [
    'selected',
    'unselected'
  ],
  status: [
    'assigned',
    'unassigned'
  ]
};

const stateMock = jest.fn();
const mockClearGroup = jest.fn();

const filterHandlers = {
  checkbox: () => {},
  clear: () => {},
  clearGroup: mockClearGroup,
  reset: () => {},
  state: stateMock
};

describe('Filters', () => {
  // eslint-disable-next-line no-unused-vars
  let renderComponent;

  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Filters
          activeFilters={activeFilters}
          data={{}}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>, translationsProperties
    );
  });

  test('renders the Selection Accordion', async () => {
    await Accordion('Application selection status').is({ open: true });
  });

  test('renders the Status Accordion', async () => {
    await Accordion('Application assignment status').is({ open: true });
  });

  it('renders Selection Checkboxes', async () => {
    await Checkbox({ id: 'clickable-filter-selection-selected' }).exists();
    await Checkbox({ id: 'clickable-filter-selection-unselected' }).exists();
  });

  it('renders Status Checkboxes', async () => {
    await Checkbox({ id: 'clickable-filter-status-assigned' }).exists();
    await Checkbox({ id: 'clickable-filter-status-unassigned' }).exists();
  });

  it('clear filter group on click is called', async () => {
    await Checkbox({ id: 'clickable-filter-selection-selected' }).click();
    await Checkbox({ id: 'clickable-filter-selection-unselected' }).click();

    await Checkbox({ id: 'clickable-filter-selection-selected', checked: true }).exists;
    await Checkbox({ id: 'clickable-filter-selection-unselected', checked: true }).exists;
  });

  test('has no a11y violations according to axe', async () => {
    expect.extend(toHaveNoViolations);

    const { container } = renderComponent;
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
