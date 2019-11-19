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
	| 'getDataForCompositeDiagram'
	| 'getDataForDiagram'
	| 'getDataSources'
	| 'getLink'
	| 'getSettings'
	| 'getUserRole'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
	| 'resetPersonalDashboard'
	| 'sendFileToMail'
;

export type Context = {
	subjectUuid: string | null,
	contentCode: string
};
