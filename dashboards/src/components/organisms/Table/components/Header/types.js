// @flow
import type {Column, Row} from 'Table/types';
import type {TableColumnHeader, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnSettings: TableColumnHeader,
	columnsWidth: Array<number>,
	data: Array<Row>,
	onChangeColumnWidth: (width: number, index: number) => void,
	onChangeSorting: TableSorting => void,
	onFinishedChangeColumnWidth: (index: number) => void,
	sorting: TableSorting,
	width: number
};
