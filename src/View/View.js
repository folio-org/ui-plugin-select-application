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

import css from './View.css';

export default function View({
  contentRef,
  data,
  onClose,
  onSave,
  checkedAppIdsMap
}) {
  const intl = useIntl();

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [checkedIdsMap, setCheckedIdsMap] = useState({ ...checkedAppIdsMap });

  const toggleChecked = (id) => {
    if (id in checkedIdsMap) {
      // eslint-disable-next-line no-unused-vars
      const { [id]: _removeId, ...withoutCurrentId } = checkedIdsMap;
      setCheckedIdsMap(withoutCurrentId);
      return;
    }

    setCheckedIdsMap({ ...checkedIdsMap, [id]: true });
  };

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

  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const columnMapping = {
    isChecked: (
      <Checkbox
        checked={isCheckedAll}
        data-testid="select-all-applications"
        onChange={() => { toggleCheckedAll(); }}
        type="checkbox"
        aria-label={intl.formatMessage({ id:"ui-plugin-select-application.selectAll"})}
      />
    ),
    name: intl.formatMessage({ id:'ui-plugin-select-application.name' })
  };

  const columnWidths = {
    isChecked: 40,
    name: 300,
  };

  const formatter = {
    isChecked: application => (
      <Checkbox
        checked={application.id in checkedIdsMap}
        onChange={() => toggleChecked(application.id)}
        type="checkbox"
        aria-label={application.name}
      />
    ),
    name: ({ name }) => <>{name}</>
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
          aria-label={`${intl.formatMessage({ id:hideOrShowMessageId })} ${intl.formatMessage({ id:'stripes-smart-components.numberOfFilters', values: { count: filterCount } })}`}
          badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
          onClick={toggleFilterPane}
          visible={filterPaneIsVisible}
        />
      </PaneMenu>
    );
  };

  const renderResultsPaneSubtitle = <FormattedMessage id="ui-plugin-select-application.applicationsFound" values={{ count:data.applications.length }} />;

  const filterPanelFooter = <PaneFooter renderStart={
    <Button onClick={onClose}><FormattedMessage id="stripes-core.button.cancel" /></Button>
  }
  />;

  const filterPanelLastMenu = <PaneMenu><CollapseFilterPaneButton onClick={toggleFilterPane} /></PaneMenu>;

  return (
    <div ref={contentRef} data-testid="search-applications-testId">
      <SearchAndSortQuery
        initialFilterState={{ status: [] }}
        initialSortState={{ sort: 'name' }}
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
                        aria-label={intl.formatMessage({ id:'stripes-smart-components.search' })}
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
                        <Button aria-label={intl.formatMessage({ id: 'stripes-core.button.saveAndClose' })} buttonStyle="primary" data-testid="submit-applications-modal" onClick={() => onSave(checkedIdsMap, onClose)}>
                          <FormattedMessage id="stripes-core.button.saveAndClose" />
                        </Button>
                      }
                      renderStart={
                        <div style={{ alignText: 'right', display:'block' }}>
                          <FormattedMessage id="ui-plugin-select-application.totalSelected" values={{ count: Object.keys(checkedIdsMap).length }} />
                        </div>
                      }
                    />
                  }
                  padContent={false}
                  renderHeader={
                    () => <PaneHeader
                      id={<FormattedMessage id="ui-plugin-select-application.applications" />}
                      firstMenu={renderResultsFirstMenu(activeFilters)}
                      paneSub={renderResultsPaneSubtitle}
                      paneTitle={<FormattedMessage id="ui-plugin-select-application.applications" />}
                    />
                  }
                >
                  <MultiColumnList
                    ariaLabel={intl.formatMessage({ id:'ui-plugin-select-application.listOfApplications' })}
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={data.applications}
                    formatter={formatter}
                    id="list-applications"
                    interactive={false}
                    rowFormatter={rowFormatter}
                    totalCount={data.applications.length}
                    virtualize
                    visibleColumns={['isChecked', 'name']}
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
  contentRef: PropTypes.object,
  data: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  source: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  checkedAppIdsMap: PropTypes.object
};

