import { filterApplications } from './Utils';

const mockApplicationsList = [
  { id: 'app1', name: 'app1' },
  { id: 'app2', name: 'app2' }
];

describe('Utils', () => {
  it('filters applications by SELECTED_STATUS', () => {
    const checkedAppIdsMap = { 'app1': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, 'status.selected');

    expect(filteredApplications).toEqual([{ id: 'app1', name: 'app1' }]);
  });

  it('filters applications by UNSELECTED_STATUS', () => {
    const checkedAppIdsMap = { 'app1': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, 'status.unselected');

    expect(filteredApplications).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('filters applications by query string', () => {
    const checkedAppIdsMap = { 'app1': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, '', 'app2');

    expect(filteredApplications).toEqual([{ id: 'app2', name: 'app2' }]);
  });
});
