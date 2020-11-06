// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {COLUMN_TYPES} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDown} from 'store/widgets/links/types';
import type {Group, TableWidget} from 'store/widgets/data/types';

export type Column = {
	accessor: string,
	aggregation: string,
	attribute: Attribute,
	columns?: Array<Column>,
	footer: string,
	group: Group,
	header: string,
	type: $Values<typeof COLUMN_TYPES>
};

export type Props = {
	data: DiagramBuildData,
	onDrillDown: DrillDown,
	onUpdate: TableWidget => void,
	widget: TableWidget
};

export type State = {
	columns: Array<Column>
};
