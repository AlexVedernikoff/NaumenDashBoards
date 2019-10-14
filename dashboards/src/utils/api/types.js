// @flow

export type Module =
	| 'dashboards'
	| 'dashboardDataSet'
	| 'dashboardSettings'
	| 'dashboardTestGetData'
	| 'DashboardsSettings'
	| 'DevDashboardSettings'
;

export type Method =
	| 'bulkEditWidget'
	| 'bulkEditDefaultWidget'
	| 'createDefaultWidgetSettings'
	| 'createPersonalWidgetSettings'
	| 'getAttributesDataSources'
	| 'getAvailabilityGroupMasterDashboard'
	| 'getDataForDiagram'
	| 'getDataSources'
	| 'getSettings'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
	| 'resetPersonalDashboard'
;

export type Context = {
	subjectUuid: string | null,
	contentCode: string
};
