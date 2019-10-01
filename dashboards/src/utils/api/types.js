// @flow
export type Module =
	| 'dashboards'
	| 'dashboardDataSet'
	| 'dashboardSettings'
	| 'dashboardTestGetData'
;

export type Method =
	| 'bulkEditWidget'
	| 'bulkEditDefaultWidget'
	| 'createDefaultWidgetSettings'
	| 'createPersonalWidgetSettings'
	| 'getAttributesDataSources'
	| 'getDataForDiagram'
	| 'getDataSources'
	| 'getSettings'
	| 'editDefaultWidget'
	| 'editPersonalWidgetSettings'
;

export type Context = {
	subjectUuid: string | null,
	contentCode: string
};
