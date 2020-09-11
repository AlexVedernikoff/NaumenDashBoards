// @flow
import type {Column, Components, Row} from 'Table/types';
import type {TableColumnHeader, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnSettings: TableColumnHeader,
	columnsWidth: Array<number>,
	components: Components,
	data: Array<Row>,
	onChangeColumnWidth: (width: number, index: number) => void,
	onChangeSorting: TableSorting => void,
	sorting: TableSorting,
	width: number
};
