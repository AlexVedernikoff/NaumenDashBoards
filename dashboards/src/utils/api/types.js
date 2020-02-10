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
	| 'createPersonalDashboard'
	| 'createWidget'
	| 'deleteCustomGroup'
	| 'deletePersonalDashboard'
	| 'deleteWidget'
	| 'getAttributesDataSources'
	| 'getAttributesFromLinkAttribute'
	| 'getDataForCompositeDiagram'
	| 'getDataForDiagram'
	| 'getDataForDiagrams'
	| 'getDataSources'
	| 'getLink'
	| 'getSettings'
	| 'getUserData'
	| 'editLayouts'
	| 'editWidget'
	| 'saveAutoUpdateSettings'
	| 'saveCustomGroup'
	| 'sendFileToMail'
	| 'updateCustomGroup'
;

export type Context = {
	contentCode: string,
	subjectUuid: string
};
