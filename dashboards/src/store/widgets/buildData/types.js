// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {BUILD_DATA_EVENTS, COLUMN_TYPES} from './constants';
import type {Group, SetCreatedWidget, TableWidget, UpdateWidget, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type BaseColumn = {
	accessor: string,
	columns?: Array<BaseColumn>,
	footer: string,
	header: string,
	type?: string,
	width?: number
};

export type ColumnType = $Keys<typeof COLUMN_TYPES>;

export type ParameterColumn = {
	...BaseColumn,
	attribute: Attribute,
	group: Group,
	type: typeof COLUMN_TYPES.PARAMETER
};

export type IndicatorData = {
	aggregation: string,
	attribute: Attribute,
};

export type BreakdownColumn = {
	...BaseColumn,
	attribute: Attribute,
	group: Group,
	indicator: IndicatorData,
	type: typeof COLUMN_TYPES.BREAKDOWN
};

export type IndicatorColumn = {
	...BaseColumn,
	aggregation: string,
	attribute: Attribute,
	type: typeof COLUMN_TYPES.INDICATOR
};

export type AttributeColumn =
	| BreakdownColumn
	| IndicatorColumn
	| ParameterColumn
	;

export type Column =
	| AttributeColumn
	| BaseColumn
	;

export type Row = {
	[accessor: string]: string
};

export type TableBuildData = {
	columns: Array<Column>,
	countTotals: number,
	data: Array<Row>,
	limitsExceeded: {
		breakdown: boolean,
		parameter: boolean
	},
	total: number
};

export type FetchBuildData = Widget => ThunkAction;

export type FetchTableBuildData = (widget: TableWidget, page?: number, update?: boolean) => ThunkAction;

export type BuildData<Data> = {
	data: Data | null,
	error: string | null,
	loading: boolean,
	type: string,
	updating: boolean
};

export type TableData = BuildData<TableBuildData>;

export type DiagramBuildData = Object;

export type DiagramData = BuildData<DiagramBuildData>;

export type WidgetDataError = {
	message: string,
	widgetId: string,
};

export type BuildDataMap = {
	[key: string]: DiagramData
};

export type ReceiveBuildDataPayload = {
	data: DiagramBuildData,
	id: string
};

export type RequestBuildData = {
	payload: Widget,
	type: typeof BUILD_DATA_EVENTS.REQUEST_BUILD_DATA
};

export type ReceiveBuildData = {
	payload: ReceiveBuildDataPayload,
	type: typeof BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA
};

export type RecordErrorBuildData = {
	payload: WidgetDataError,
	type: typeof BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR
};

type UpdateBuildData = {
	payload: string,
	type: typeof BUILD_DATA_EVENTS.UPDATE_BUILD_DATA
};

type UnknownBuildDataAction = {
	type: typeof BUILD_DATA_EVENTS.UNKNOWN_BUILD_DATA_ACTION
};

export type BuildDataAction =
	| ReceiveBuildData
	| RecordErrorBuildData
	| RequestBuildData
	| SetCreatedWidget
	| UpdateWidget
	| UpdateBuildData
	| UnknownBuildDataAction
;

export type BuildDataState = BuildDataMap;

export type DataSetDescriptorRelation = {
	dataKey: string,
	descriptor: string
};
