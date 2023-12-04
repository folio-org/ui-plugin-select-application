import { MemoryRouter } from 'react-router-dom';

import {
  MultiColumnList,
  Pane,
  renderWithIntl,
  SearchField,
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../test/helpers';

import View from './View';

import mockApplications from './testResources';

jest.mock('../Filters', () => () => <div>Filters</div>);

const source = {
  'totalCount': () => {},
  'loaded': () => {},
  'pending': () => {},
  'failure': () => {},
  'failureMessage': () => {},
};

const onNeedMoreData = jest.fn();
const onSelectRow = jest.fn();
const queryGetter = jest.fn();
const querySetter = jest.fn();

describe('View', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <View
          data={{ applications: mockApplications, total: 9 }}
          onNeedMoreData={onNeedMoreData}
          onSelectRow={onSelectRow}
          queryGetter={queryGetter}
          querySetter={querySetter}
          source={source}
          visibleColumns={['', 'name']}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Filters component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Filters')).toBeInTheDocument();
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected search field', async () => {
    await SearchField().has({ id: 'input-applications-search' });
  });

  test('renders the expected MCL', async () => {
    await MultiColumnList('list-applications').exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['', 'Name'] }).exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 2 }).exists();
  });
});
