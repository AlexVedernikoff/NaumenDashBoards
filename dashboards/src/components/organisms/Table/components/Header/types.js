// @flow
import type {Column, ColumnsWidth, Components, Row} from 'Table/types';
import type {TableHeaderSettings, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnSettings: TableHeaderSettings,
	columnsWidth: ColumnsWidth,
	components: Components,
	data: Array<Row>,
	fixedColumnsCount: number,
	fixedLeft: number,
	onChangeColumnWidth: (width: number, column: Column) => void,
	onChangeSorting: TableSorting => void,
	sorting: TableSorting,
	width: number
};
