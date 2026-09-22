import { filterApplicationsByQuery, filterBySelectionAndStatus } from './Utils';

const mockApplicationsList = [
  { id: 'app1', name: 'app1' },
  { id: 'app2', name: 'app2' }
];

describe('filterApplicationsByQuery', () => {
  it('filters applications by query string', () => {
    const filteredApplications = filterApplicationsByQuery(mockApplicationsList, 'app2');

    expect(filteredApplications).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('returns all applications when no query is provided', () => {
    const filteredApplications = filterApplicationsByQuery(mockApplicationsList, '');

    expect(filteredApplications).toEqual(mockApplicationsList);
  });

  it('returns empty object if applications is undefined', () => {
    const filteredApplications = filterApplicationsByQuery(undefined, '');

    expect(filteredApplications).toEqual({});
  });

  it('returns empty array if no applications match the query', () => {
    const filteredApplications = filterApplicationsByQuery(mockApplicationsList, 'nonexistent');

    expect(filteredApplications).toEqual([]);
  });
});

describe('filterBySelectionAndStatus', () => {
  it('returns all applications when no filters are active', () => {
    const filtered = filterBySelectionAndStatus(mockApplicationsList, {}, {}, {});

    expect(filtered).toEqual(mockApplicationsList);
  });

  it('filters by selected checkbox state', () => {
    const checkedIdsMap = { app1: true };
    const filtered = filterBySelectionAndStatus(mockApplicationsList, checkedIdsMap, {}, { selection: ['selected'] });

    expect(filtered).toEqual([{ id: 'app1', name: 'app1' }]);
  });

  it('filters by unselected checkbox state', () => {
    const checkedIdsMap = { app1: true };
    const filtered = filterBySelectionAndStatus(mockApplicationsList, checkedIdsMap, {}, { selection: ['unselected'] });

    expect(filtered).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('filters by assigned status, independent of checkbox state', () => {
    const checkedIdsMap = { app2: true };
    const assignedAppIdsMap = { app1: true };
    const filtered = filterBySelectionAndStatus(mockApplicationsList, checkedIdsMap, assignedAppIdsMap, { status: ['assigned'] });

    expect(filtered).toEqual([{ id: 'app1', name: 'app1' }]);
  });

  it('filters by unassigned status, independent of checkbox state', () => {
    const checkedIdsMap = { app1: true };
    const assignedAppIdsMap = { app1: true };
    const filtered = filterBySelectionAndStatus(mockApplicationsList, checkedIdsMap, assignedAppIdsMap, { status: ['unassigned'] });

    expect(filtered).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('combines selection and status filters independently (AND across groups)', () => {
    const checkedIdsMap = { app1: true, app2: true };
    const assignedAppIdsMap = { app1: true };
    const filtered = filterBySelectionAndStatus(
      mockApplicationsList,
      checkedIdsMap,
      assignedAppIdsMap,
      { selection: ['selected'], status: ['unassigned'] },
    );

    // app1 is selected but assigned; app2 is selected and unassigned -> only app2 matches both.
    expect(filtered).toEqual([{ id: 'app2', name: 'app2' }]);
  });

  it('checkbox interactions never affect the status filter result', () => {
    const assignedAppIdsMap = { app1: true };

    const uncheckedResult = filterBySelectionAndStatus(mockApplicationsList, {}, assignedAppIdsMap, { status: ['assigned'] });
    const checkedResult = filterBySelectionAndStatus(mockApplicationsList, { app1: true, app2: true }, assignedAppIdsMap, { status: ['assigned'] });

    expect(uncheckedResult).toEqual([{ id: 'app1', name: 'app1' }]);
    expect(checkedResult).toEqual([{ id: 'app1', name: 'app1' }]);
  });

  it('returns empty array if no applications match the active filters', () => {
    const filtered = filterBySelectionAndStatus(mockApplicationsList, {}, {}, { status: ['assigned'] });

    expect(filtered).toEqual([]);
  });
});
