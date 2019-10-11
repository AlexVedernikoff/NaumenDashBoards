// @flow

export type Module =
	| 'dashboards'
	| 'dashboardDataSet'
	| 'dashboardDrildown'
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
	| 'getLink'
	| 'getSettings'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
	| 'resetPersonalDashboard'
;

export type Context = {
	subjectUuid: string | null,
	contentCode: string
};
