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
	| 'deleteCustomGroup'
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
	| 'saveCustomGroup'
	| 'sendFileToMail'
	| 'updateCustomGroup'
;

export type Context = {
	contentCode: string,
	subjectUuid: string
};
