// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {COLUMN_TYPES} from './constants';
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {Group, SetCreatedWidget, TableWidget, UpdateWidget, Widget, WidgetTooltip} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type BaseColumn = {
	accessor: string,
	columns?: Array<BaseColumn>,
	footer: string,
	header: string,
	tooltip?: WidgetTooltip | null,
	type?: string,
	width?: number
};

export type PivotBaseColumn = {
	...BaseColumn,
	columns?: Array<PivotBaseColumn>,
	height: number,
	sumKeys?: string[],
	width: number
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

export type SingleRowInfoBreakdown = {
    attribute: Attribute,
    type: string
};

export type SingleRowInfoIndicator = {
    attribute: Attribute,
    type: $Keys<typeof DEFAULT_AGGREGATION> | $Keys<typeof INTEGER_AGGREGATION>
};

export type SingleRowInfoSource = {
    classFqn: string,
    descriptor: string
};

export type SingleRowInfo = {
    breakdown: SingleRowInfoBreakdown,
    indicator: SingleRowInfoIndicator,
    source: SingleRowInfoSource
};

export type TableBuildData = {
	columns: Array<Column>,
	countTotals: number,
	data: Array<Row>,
	limitsExceeded: {
		breakdown: boolean,
		parameter: boolean
	},
	rowsInfo?: Array<SingleRowInfo>,
	total: number
};

export type PivotBuildData = {
	columns: Array<Column>,
	data: Array<Row>,
	total: number
};

export type FetchBuildDataAction = Widget => ThunkAction;

export type FetchTableBuildDataAction = (widget: TableWidget, page?: number, update?: boolean) => ThunkAction;

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
	type: 'widgets/buildData/requestBuildData'
};

export type ReceiveBuildData = {
	payload: ReceiveBuildDataPayload,
	type: 'widgets/buildData/receiveBuildData'
};

export type RecordErrorBuildData = {
	payload: WidgetDataError,
	type: 'widgets/buildData/recordBuildDataError'
};

type UpdateBuildData = {
	payload: string,
	type: 'widgets/buildData/updateBuildData'
};

type UnknownBuildDataAction = {
	type: 'widgets/buildData/unknownBuildDataAction'
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
