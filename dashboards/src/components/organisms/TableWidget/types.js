// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {COLUMN_TYPES} from './constants';
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
import type {FetchBuildData} from 'store/widgets/buildData/types';
import type {Group, TableWidget} from 'store/widgets/data/types';

export type BaseColumn = {
	accessor: string,
	columns?: Array<BaseColumn>,
	footer: string,
	header: string,
	type?: string
};

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

type LimitsExceeded = {
	breakdown: boolean,
	parameter: boolean
};

type Row = {
	[accessor: string]: string | number
};

export type Data = {
	columns: Array<Column>,
	data: Array<Row>,
	limitsExceeded: LimitsExceeded
};

export type Props = {
	data: Data,
	onDrillDown: DrillDown,
	onFetchBuildData: FetchBuildData,
	onOpenCardObject: OpenCardObject,
	onUpdate: TableWidget => void,
	widget: TableWidget
};

export type State = {
	columns: Array<Column>
};
