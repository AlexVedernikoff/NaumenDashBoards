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
	| 'getAttributesFromLinkAttribute'
	| 'getAttributeObject'
	| 'getCatalogItemObject'
	| 'getCatalogObject'
	| 'getDataForCompositeDiagram'
	| 'getDataForDiagram'
	| 'getDataForDiagrams'
	| 'getDataSourceAttributes'
	| 'getDataSources'
	| 'getDynamicAttributes'
	| 'getDynamicAttributeGroups'
	| 'getLink'
	| 'getMetaClasses'
	| 'getSettings'
	| 'getStates'
	| 'getUserData'
	| 'editLayouts'
	| 'editWidget'
	| 'editWidgetChunkData'
	| 'saveAutoUpdateSettings'
	| 'saveCustomGroup'
	| 'sendFileToMail'
	| 'updateCustomGroup'
;

export type Context = {
	contentCode: string,
	subjectUuid: string
};
