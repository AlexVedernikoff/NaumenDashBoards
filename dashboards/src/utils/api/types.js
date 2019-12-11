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
	| 'getDataForDiagrams'
	| 'getDataSources'
	| 'getLink'
	| 'getSettings'
	| 'getUserRole'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
	| 'resetPersonalDashboard'
	| 'saveAutoUpdateSettings'
	| 'sendFileToMail'
;

export type Context = {
	subjectUuid: string,
	contentCode: string
};
