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

  it('returns all applications when no filter or query is provided', () => {
    const checkedAppIdsMap = {};
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, '');

    expect(filteredApplications).toEqual(mockApplicationsList);
  });

  it('returns empty array if applications is undefined', () => {
    const checkedAppIdsMap = {};
    const filteredApplications = filterApplications(undefined, checkedAppIdsMap, '');

    expect(filteredApplications).toEqual({});
  });

  it('filters applications by query and SELECTED_STATUS together', () => {
    const checkedAppIdsMap = { 'app2': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, 'status.selected', 'app2');

    expect(filteredApplications).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('filters applications by query and UNSELECTED_STATUS together', () => {
    const checkedAppIdsMap = { 'app1': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, 'status.unselected', 'app2');

    expect(filteredApplications).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('returns empty array if no applications match the query', () => {
    const checkedAppIdsMap = {};
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, '', 'nonexistent');

    expect(filteredApplications).toEqual([]);
  });

  it('returns empty array if no applications match the filter', () => {
    const checkedAppIdsMap = { 'app3': true };
    const filteredApplications = filterApplications(mockApplicationsList, checkedAppIdsMap, 'status.selected');

    expect(filteredApplications).toEqual([]);
  });
});
