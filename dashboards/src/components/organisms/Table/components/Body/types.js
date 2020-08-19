// @flow
import type {Column, Components, OnClickCell, Row} from 'Table/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	components: Components,
	data: Array<Row>,
	onClickCell: OnClickCell,
	page: number,
	pageSize: number,
	settings: Table,
	sorting: TableSorting,
	width: number
};
