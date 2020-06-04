// @flow
import type {Column, RenderValue, Row} from 'Table/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	data: Array<Row>,
	page: number,
	pageSize: number,
	renderValue: RenderValue,
	settings: Table,
	sorting: TableSorting,
	width: number
};

export type RenderCellProps = {|
	key: string,
	width: number
|};
