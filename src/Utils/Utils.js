const SELECTED_STATUS = 'status.selected';
const UNSELECTED_STATUS = 'status.unselected';

export const filterApplications = (applications, checkedAppIdsMap, filter, query) => {
  let results = applications || {};

  if (query) {
    results = results.filter(app => app.id.toLowerCase().includes(query.toLowerCase()));
  }
  if (filter === SELECTED_STATUS) {
    results = results.filter(app => app.id in checkedAppIdsMap);
  }
  if (filter === UNSELECTED_STATUS) {
    results = results.filter(app => !(app.id in checkedAppIdsMap));
  }

  return results;
};
