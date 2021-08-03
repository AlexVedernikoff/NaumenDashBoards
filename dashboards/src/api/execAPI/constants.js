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
	{method: 'getSettings', module: 'dashboardSettings'},
	{method: 'getUserData', module: 'dashboardSettings'},
	{method: 'saveAutoUpdateSettings', module: 'dashboardSettings'},
	{method: 'saveCustomColors', module: 'dashboardSettings'},
	{method: 'saveCustomGroup', module: 'dashboardSettings'},
	{method: 'updateCustomGroup', module: 'dashboardSettings'}
];

export const DISABLE_GET_METHOD = [
	{method: 'getTest', module: 'dashboards'}
];
