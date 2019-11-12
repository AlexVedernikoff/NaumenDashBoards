// @flow
export type Module =
	| 'dashboards'
	| 'dashboardDataSet'
	| 'dashboardDrilldown'
	| 'dashboardSendEmail'
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
	| 'deleteWidget'
	| 'getAttributesDataSources'
	| 'getAvailabilityGroupMasterDashboard'
	| 'getDataForCompositeDiagram'
	| 'getDataForDiagram'
	| 'getDataSources'
	| 'getLink'
	| 'getSettings'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
	| 'resetPersonalDashboard'
	| 'sendFileToMail'
;

export type Context = {
	subjectUuid: string | null,
	contentCode: string
};
