// @flow
export const IS_USER_NEEDED_LIST = [
	{method: 'createPersonalDashboard', module: 'dashboardSettings'},
	{method: 'createWidget', module: 'dashboardSettings'},
	{method: 'deleteCustomColors', module: 'dashboardSettings'},
	{method: 'deleteCustomGroup', module: 'dashboardSettings'},
	{method: 'deletePersonalDashboard', module: 'dashboardSettings'},
	{method: 'deleteSourceFilters', module: 'dashboardSettings'},
	{method: 'deleteWidget', module: 'dashboardSettings'},
	{method: 'disableAutoUpdate', module: 'dashboardSettings'},
	{method: 'editLayouts', module: 'dashboardSettings'},
	{method: 'editWidget', module: 'dashboardSettings'},
	{method: 'editWidgetChunkData', module: 'dashboardSettings'},
	{method: 'enableAutoUpdate', module: 'dashboardSettings'},
	{method: 'getAttributesFromLinkAttribute', module: 'dashboards'},
	{method: 'getDashboardLink', module: 'dashboards'},
	{method: 'getDashboardsAndWidgetsTree', module: 'dashboardSettings'},
	{method: 'getDataForCompositeDiagram', module: 'dashboardDataSet'},
	{method: 'getDataForTableDiagram', module: 'dashboardDataSet'},
	{method: 'getSettings', module: 'dashboardSettings'},
	{method: 'getUserData', module: 'dashboardSettings'},
	{method: 'saveAutoUpdateSettings', module: 'dashboardSettings'},
	{method: 'saveCustomColors', module: 'dashboardSettings'},
	{method: 'saveCustomGroup', module: 'dashboardSettings'},
	{method: 'saveSourceFilters', module: 'dashboardSettings'},
	{method: 'updateCustomGroup', module: 'dashboardSettings'},
	{method: 'widgetIsBadToCopy', module: 'dashboardSettings'}
];

export const DISABLE_GET_METHOD = [
	{method: 'getTest', module: 'dashboards'}
];

const FILTER_ALREADY_EXISTS: 'filterAlreadyExists' = 'filterAlreadyExists';
const FILTER_MUST_NOT_BE_REMOVED: 'filterMustNotBeRemoved' = 'filterMustNotBeRemoved';
const FILTER_NAME_NOT_UNIQUE: 'filterNameNotUnique' = 'filterNameNotUnique';
const PERSONAL_DASHBOARD_NOT_FOUND: 'personalDashboardNotFound' = 'personalDashboardNotFound';
const REMOVE_FILTER_FAILED: 'removeFilterFailed' = 'removeFilterFailed';
const WIDGET_NOT_FOUND: 'widgetNotFound' = 'widgetNotFound';

export const ERRORS = {
	FILTER_ALREADY_EXISTS,
	FILTER_MUST_NOT_BE_REMOVED,
	FILTER_NAME_NOT_UNIQUE,
	PERSONAL_DASHBOARD_NOT_FOUND,
	REMOVE_FILTER_FAILED,
	WIDGET_NOT_FOUND
};
