import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

import {
  MultiColumnList,
  Pane,
  renderWithIntl,
  SearchField,
  MultiColumnListHeader,
  Checkbox,
  MultiColumnListRow
} from '@folio/stripes-erm-testing';

import { act } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
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
    await MultiColumnList({ columns: ['', 'Name', 'Status'] }).exists();
  });

  it('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 3 }).exists();
  });

  it('selects all application rows on header checkbox click', async () => {
    await act(async () => {
      await MultiColumnListHeader({ id: 'list-column-ischecked' }).find(Checkbox({ checked: false })).click();
    });

    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).exists();
  });

  it('selects first row on checkbox click', async () => {
    await act(async () => {
      await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: false })).click();
    });

    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).exists();
  });

  it('unselects selected row', async () => {
    await act(async () => {
      await MultiColumnListRow({ indexRow: 'row-1' }).find(Checkbox({ checked: true })).click();
    });

    await MultiColumnListRow({ indexRow: 'row-1' }).find(Checkbox({ checked: false })).exists();
  });

  it('calls onSave action on submit button', async () => {
    const { getByTestId } = renderComponent;

    await act(async () => {
      await userEvent.click(getByTestId('submit-applications-modal'));
    });

    expect(onSaveMock).toHaveBeenCalled();
  });

  it('has no a11y violations according to axe', async () => {
    expect.extend(toHaveNoViolations);

    const { container } = renderComponent;
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});

describe('View Status column', () => {
  const assignedAppIdsMap = { 1: true };
  const unassignedCount = mockApplications.length - 1;

  const renderWithAssigned = () => renderWithIntl(
    <MemoryRouter>
      <View
        assignedAppIdsMap={assignedAppIdsMap}
        checkedAppIdsMap={{ 2: true }}
        data={{ applications: mockApplications }}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />
    </MemoryRouter>,
    translationsProperties
  );

  it('shows Assigned for applications present in assignedAppIdsMap', () => {
    const { getAllByText } = renderWithAssigned();

    expect(getAllByText('Assigned')).toHaveLength(1);
  });

  it('shows Unassigned for applications not present in assignedAppIdsMap', () => {
    const { getAllByText } = renderWithAssigned();

    expect(getAllByText('Unassigned')).toHaveLength(unassignedCount);
  });

  it('does not change status when a checkbox is toggled', async () => {
    const { getAllByText } = renderWithAssigned();

    await act(async () => {
      await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: false })).click();
    });

    expect(getAllByText('Assigned')).toHaveLength(1);
    expect(getAllByText('Unassigned')).toHaveLength(unassignedCount);
  });
});
