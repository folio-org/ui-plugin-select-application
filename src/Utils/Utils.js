const SELECTED_STATUS = 'status.selected';
const UNSELECTED_STATUS = 'status.unselected';

export const filterApplications = (applications, checkedAppIdsMap, filter, query) => {
  if (filter === SELECTED_STATUS) {
    return applications.filter(app => app.id in checkedAppIdsMap);
  }

  if (filter === UNSELECTED_STATUS) {
    return applications.filter(app => !(app.id in checkedAppIdsMap));
  }

  if (query) {
    return applications.filter(app => app.id.includes(query));
  }
  return applications;
};
