// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {COLUMN_TYPES} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
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

export type Props = {
	data: DiagramBuildData,
	onDrillDown: DrillDown,
	onOpenCardObject: OpenCardObject,
	onUpdate: TableWidget => void,
	widget: TableWidget
};

export type State = {
	columns: Array<Column>
};
