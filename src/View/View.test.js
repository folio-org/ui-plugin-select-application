import { MemoryRouter } from 'react-router-dom';

import {
  MultiColumnList,
  Pane,
  renderWithIntl,
  SearchField,
  MultiColumnListHeader,
  Checkbox,
  MultiColumnListRow
} from '@folio/stripes-erm-testing';

import userEvent from '@testing-library/user-event';
import translationsProperties from '../../test/helpers';

import View from './View';

import mockApplications from './testResources';

jest.mock('../Filters', () => () => <div>Filters</div>);

const onSaveMock = jest.fn();
const onCloseMock = jest.fn();

describe('View', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <View
          checkedAppIdsMap={{ 2: true }}
          data={{ applications: mockApplications }}
          onClose={onCloseMock}
          onSave={onSaveMock}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the Filters component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Filters')).toBeInTheDocument();
  });

  it('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  it('renders the expected search field', async () => {
    await SearchField().has({ id: 'input-applications-search' });
  });

  it('renders the expected MCL', async () => {
    await MultiColumnList('list-applications').exists();
  });

  it('renders expected columns', async () => {
    await MultiColumnList({ columns: ['', 'Name'] }).exists();
  });

  it('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 2 }).exists();
  });

  it('selects all application rows on header checkbox click', async () => {
    await MultiColumnListHeader({ id: 'list-column-ischecked' }).find(Checkbox({ checked: false })).click();

    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).exists();
  });

  it('selects first row on checkbox click', async () => {
    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: false })).click();

    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).exists();
  });

  it('unselects selected row', async () => {
    await MultiColumnListRow({ indexRow: 'row-1' }).find(Checkbox({ checked: true })).click();

    await MultiColumnListRow({ indexRow: 'row-1' }).find(Checkbox({ checked: false })).exists();
  });

  it('calls onSave action on submit button', async () => {
    const { getByTestId } = renderComponent;

    await userEvent.click(getByTestId('submit-applications-modal'));

    expect(onSaveMock).toHaveBeenCalled();
  });
});
