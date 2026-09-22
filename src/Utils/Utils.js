// Combines several `app => boolean` predicates into one that requires all of them to pass.
const every = (...predicates) => (app) => predicates.every(predicate => predicate(app));

const queryFilter = (query) => (app) => !query || app.id.toLowerCase().includes(query.toLowerCase());

const SELECTION_VALUES = ['selected', 'unselected'];
const STATUS_VALUES = ['assigned', 'unassigned'];

// No filters selected or all filters selected means the group isn't filtered (everything matches.)
const groupFilter = (activeValues, allValues, valueOf) => (app) => (
  activeValues.length === 0
  || activeValues.length === allValues.length
  || activeValues.includes(valueOf(app))
);

// 'selection' evaluated against `selectionMap` (a snapshot of checkbox state taken when the
// filter's own values last changed) This keeps rows from disappearing right after their checkbox
// is checked/unchecked.
const selectionFilter = (selectionMap, activeValues) => groupFilter(
  activeValues,
  SELECTION_VALUES,
  app => (app.id in selectionMap ? 'selected' : 'unselected'),
);

// 'status' evaluated against the API-driven `assignedAppIdsMap`, which never changes as a result
// of checkbox interactions.
const statusFilter = (assignedAppIdsMap, activeValues) => groupFilter(
  activeValues,
  STATUS_VALUES,
  app => (app.id in assignedAppIdsMap ? 'assigned' : 'unassigned'),
);

export const filterApplicationsByQuery = (applications, query) => {
  const results = applications || {};

  return query ? results.filter(queryFilter(query)) : results;
};

export const filterBySelectionAndStatus = (applications, selectionMap, assignedAppIdsMap, activeFilters = {}) => {
  const selection = activeFilters.selection || [];
  const status = activeFilters.status || [];

  return (applications || []).filter(every(
    selectionFilter(selectionMap, selection),
    statusFilter(assignedAppIdsMap, status),
  ));
};
