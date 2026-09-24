import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset,
  PaneFooter,
  Checkbox,
  PaneHeader
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  SearchAndSortSearchButton as FilterPaneToggle,
  CollapseFilterPaneButton
} from '@folio/stripes/smart-components';

import Filters from '../Filters';
import { filterBySelectionAndStatus } from '../Utils';

import css from './View.css';

export default function View({
  contentRef,
  data,
  onClose,
  onSave,
  checkedAppIdsMap,
  assignedAppIdsMap,
  initialSearch,
  queryGetter,
  querySetter
}) {
  const intl = useIntl();

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [checkedIdsMap, setCheckedIdsMap] = useState({ ...checkedAppIdsMap });

  // Snapshot at entry, used as the assigned-status fallback below so it doesn't shift mid-session.
  const initialCheckedIdsMapRef = useRef({ ...checkedAppIdsMap });

  const toggleChecked = (id) => {
    if (id in checkedIdsMap) {
      // eslint-disable-next-line no-unused-vars
      const { [id]: _removeId, ...withoutCurrentId } = checkedIdsMap;
      setCheckedIdsMap(withoutCurrentId);
      return;
    }

    setCheckedIdsMap({ ...checkedIdsMap, [id]: true });
  };

  // Fallback when assignedAppIdsMap isn't supplied, rather than showing every app as "Unassigned".
  const effectiveAssignedAppIdsMap = assignedAppIdsMap !== undefined ? assignedAppIdsMap : initialCheckedIdsMapRef.current;

  const isCheckedAll = Object.keys(checkedIdsMap).length === data.applications.length;

  const toggleCheckedAll = () => {
    if (isCheckedAll) {
      setCheckedIdsMap({});
    } else {
      const allIdsMap = data.applications.reduce((acc, app) => {
        acc[app.id] = true;
        return acc;
      }, {});
      setCheckedIdsMap(allIdsMap);
    }
  };

  // Snapshot of checkbox state used by the Selected/Unselected filter, so that checking/unchecking
  // a row while that filter is active doesn't make the row jump in or out of the visible list.
  const selectionSnapshotRef = useRef({});
  const lastSelectionFilterKeyRef = useRef(null);

  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const columnMapping = {
    isChecked: (
      <Checkbox
        aria-label={intl.formatMessage({ id: 'ui-plugin-select-application.selectAll' })}
        checked={isCheckedAll}
        data-testid="select-all-applications"
        onChange={() => { toggleCheckedAll(); }}
        type="checkbox"
      />
    ),
    name: intl.formatMessage({ id: 'ui-plugin-select-application.name' }),
    status: intl.formatMessage({ id: 'ui-plugin-select-application.status' })
  };

  const columnWidths = {
    isChecked: 40,
    name: 300,
    status: 120,
  };

  const formatter = {
    isChecked: application => (
      <Checkbox
        aria-label={application.name}
        checked={application.id in checkedIdsMap}
        onChange={() => toggleChecked(application.id)}
        type="checkbox"
      />
    ),
    name: ({ name }) => <>{name}</>,
    status: application => (
      <FormattedMessage
        id={application.id in effectiveAssignedAppIdsMap ? 'ui-plugin-select-application.assigned' : 'ui-plugin-select-application.unassigned'}
      />
    )
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex = {}, rowProps, cells } = row;
    const rowLabel = [rowData.name].join('...');

    return (
      <div
        key={`row-${rowIndex}`}
        className={rowClass}
        data-label={rowLabel}
        {...rowProps}
      >
        {cells}
      </div>
    );
  };

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const renderResultsFirstMenu = (filters) => {
    if (filterPaneIsVisible) return null;

    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FilterPaneToggle
          aria-label={`${intl.formatMessage({ id: hideOrShowMessageId })} ${intl.formatMessage({ id: 'stripes-smart-components.numberOfFilters', values: { count: filterCount } })}`}
          badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
          onClick={toggleFilterPane}
          visible={filterPaneIsVisible}
        />
      </PaneMenu>
    );
  };

  const renderResultsPaneSubtitle = (count) => <FormattedMessage id="ui-plugin-select-application.applicationsFound" values={{ count }} />;

  const filterPanelFooter = <PaneFooter renderStart={
    <Button onClick={onClose}><FormattedMessage id="stripes-core.button.cancel" /></Button>
  }
  />;

  const filterPanelLastMenu = <PaneMenu><CollapseFilterPaneButton onClick={toggleFilterPane} /></PaneMenu>;

  return (
    <div ref={contentRef} data-testid="search-applications-testId">
      <SearchAndSortQuery
        initialFilterState={{ selection: [], status: [] }}
        initialSearch={initialSearch}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
      >
        {
          ({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
            getFilterHandlers
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged);

            // Re-take the selection snapshot only when the Selected/Unselected filter's own active
            // values actually change (e.g. the user (un)checks a filter option), not on every
            // render — a row checkbox click alone must not shift what's frozen in the snapshot.
            const selectionValues = activeFilters.state.selection || [];
            const selectionFilterKey = selectionValues.slice().sort().join(',');
            if (lastSelectionFilterKeyRef.current !== selectionFilterKey) {
              lastSelectionFilterKeyRef.current = selectionFilterKey;
              selectionSnapshotRef.current = { ...checkedIdsMap };
            }

            const displayedApplications = filterBySelectionAndStatus(data.applications, selectionSnapshotRef.current, effectiveAssignedAppIdsMap, activeFilters.state);
            return (
              <Paneset id="applications-paneset">
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="25%"
                    footer={filterPanelFooter}
                    renderHeader={() => <PaneHeader
                      lastMenu={filterPanelLastMenu}
                      onClose={toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    />}
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div className={css.searchGroupWrap}>
                        <SearchField
                          aria-label={<FormattedMessage id="ui-plugin-select-application.search" />}
                          autoFocus
                          className={css.searchField}
                          data-test-application-search-input
                          id="input-applications-search"
                          inputRef={searchField}
                          marginBottom0
                          name="query"
                          onChange={getSearchHandlers().query}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query}
                          fullWidth
                          id="clickable-search-applications"
                          marginBottom0
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div>
                        <Button
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                      <Filters
                        activeFilters={activeFilters.state}
                        data={data.applications}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  defaultWidth="fill"
                  footer={
                    <PaneFooter
                      renderEnd={
                        <Button buttonStyle="primary" data-testid="submit-applications-modal" onClick={() => onSave(checkedIdsMap, onClose)}>
                          <FormattedMessage id="stripes-core.button.saveAndClose" />
                        </Button>
                      }
                      renderStart={
                        <div style={{ alignText: 'right', display: 'block' }}>
                          <FormattedMessage id="ui-plugin-select-application.totalSelected" values={{ count: Object.keys(checkedIdsMap).length }} />
                        </div>
                      }
                    />
                  }
                  padContent={false}
                  renderHeader={
                    () => <PaneHeader
                      firstMenu={renderResultsFirstMenu(activeFilters)}
                      id={<FormattedMessage id="ui-plugin-select-application.applications" />}
                      paneSub={renderResultsPaneSubtitle(displayedApplications.length)}
                      paneTitle={<FormattedMessage id="ui-plugin-select-application.applications" />}
                    />
                  }
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={displayedApplications.toSorted((a, b) => a.name.localeCompare(b.name))}
                    formatter={formatter}
                    id="list-applications"
                    interactive={false}
                    rowFormatter={rowFormatter}
                    totalCount={displayedApplications.length}
                    visibleColumns={['isChecked', 'name', 'status']}
                  />
                </Pane>
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
}


View.propTypes = {
  children: PropTypes.node,
  contentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  data: PropTypes.shape({
    applications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  source: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  checkedAppIdsMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.bool
  }),
  assignedAppIdsMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.bool
  }),
  initialSearch: PropTypes.string,
};
