import { MemoryRouter } from 'react-router-dom';

import {
  Checkbox,
  MultiColumnList,
  MultiColumnListRow,
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import { act } from '@folio/jest-config-stripes/testing-library/react';
import translationsProperties from '../../test/helpers';

import View from './View';

import mockApplications from './testResources';

// Filters is intentionally NOT mocked here so the real Selected/Unselected filter checkboxes
// can be driven end-to-end.

const onSaveMock = jest.fn();
const onCloseMock = jest.fn();

describe('View Selected/Unselected filter snapshot behavior', () => {
  const renderComponent = () => renderWithIntl(
    <MemoryRouter>
      <View
        checkedAppIdsMap={{ 1: true, 2: true }}
        data={{ applications: mockApplications }}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />
    </MemoryRouter>,
    translationsProperties
  );

  it('does not remove a row from the "Selected" filter view when its checkbox is unchecked afterwards', async () => {
    renderComponent();

    // Activate the "Selected" filter: only apps 1 (Agreements) and 2 (Bulk Edit) are checked.
    await act(async () => {
      await Checkbox({ id: 'clickable-filter-selection-selected' }).click();
    });

    await MultiColumnList({ rowCount: 2 }).exists();

    // Uncheck the first visible row (Agreements, app id 1) while the "Selected" filter is active.
    await act(async () => {
      await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).click();
    });

    // The row must still be visible (snapshot-based filtering), even though its checkbox is now unchecked.
    await MultiColumnList({ rowCount: 2 }).exists();
    await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: false })).exists();
  });

  it('re-snapshots when the filter is toggled off and back on', async () => {
    renderComponent();

    await act(async () => {
      await Checkbox({ id: 'clickable-filter-selection-selected' }).click();
    });
    await MultiColumnList({ rowCount: 2 }).exists();

    // Uncheck app 1's row while "Selected" is active — row stays per the snapshot.
    await act(async () => {
      await MultiColumnListRow({ indexRow: 'row-0' }).find(Checkbox({ checked: true })).click();
    });
    await MultiColumnList({ rowCount: 2 }).exists();

    // Turn the filter off, then back on: this should take a fresh snapshot reflecting the
    // now-unchecked app 1, leaving only app 2 selected.
    await act(async () => {
      await Checkbox({ id: 'clickable-filter-selection-selected' }).click();
    });
    await act(async () => {
      await Checkbox({ id: 'clickable-filter-selection-selected' }).click();
    });

    await MultiColumnList({ rowCount: 1 }).exists();
  });
});
