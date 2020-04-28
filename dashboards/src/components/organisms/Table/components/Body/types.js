// @flow
import type {Column, Row} from 'Table/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	data: Array<Row>,
	page: number,
	pageSize: number,
	settings: Table,
	sorting: TableSorting,
	width: number
};
