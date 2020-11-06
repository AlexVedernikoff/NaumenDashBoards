// @flow
import type {Column, ColumnsWidth, Components, Row} from 'Table/types';
import type {TableColumnHeader, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnSettings: TableColumnHeader,
	columnsWidth: ColumnsWidth,
	components: Components,
	data: Array<Row>,
	onChangeColumnWidth: (width: number, column: Column) => void,
	onChangeSorting: TableSorting => void,
	sorting: TableSorting,
	width: number
};
