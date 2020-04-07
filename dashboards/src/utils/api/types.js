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
	| 'getAllAttributes'
	| 'getAttributesDataSources'
	| 'getAttributesFromLinkAttribute'
	| 'getAttributeObject'
	| 'getCatalogItemObject'
	| 'getCatalogObject'
	| 'getDataForCompositeDiagram'
	| 'getDataForDiagram'
	| 'getDataForDiagrams'
	| 'getDataSources'
	| 'getLink'
	| 'getMetaClasses'
	| 'getSettings'
	| 'getStates'
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
