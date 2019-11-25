// @flow
export type Module =
	| 'dashboards'
	| 'dashboardDataSet'
	| 'dashboardDrilldown'
	| 'dashboardSendEmail'
	| 'dashboardSettings'
	| 'dashboardTestGetData'
	| 'DashboardsSettings'
;

export type Method =
	| 'bulkEditWidget'
	| 'bulkEditDefaultWidget'
	| 'createDefaultWidgetSettings'
	| 'createPersonalWidgetSettings'
	| 'deletePersonalWidget'
	| 'deleteWidget'
	| 'getAttributesDataSources'
	| 'getAttributesFromLinkAttribute'
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
	subjectUuid: string,
	contentCode: string
};
