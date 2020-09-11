// @flow
import type {DefaultProps as DefaultCellProps, Props as CellProps} from './components/Cell/types';
import type {Props as HeaderProps} from './components/HeaderCell/types';
import type {Props as RowProps} from './components/Row/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Column = {
	accessor: string,
	footer: string,
	header: string,
	[string]: any
};

export type Row = {
	[accessor: string]: string
};

export type ValueProps = {
	columnIndex: number,
	value: string | number
};

export type Components = $Shape<{
	Cell: React$ComponentType<React$Config<CellProps, DefaultCellProps>>,
	HeaderCell: React$ComponentType<HeaderProps>,
	Row: React$ComponentType<RowProps>,
	Value: React$ComponentType<ValueProps>
}>;

export type OnClickCellProps = {
	columnIndex: number,
	rowIndex: number,
	value: number | string
};

export type OnClickDataCell = (event: MouseEvent, props: OnClickCellProps) => void;

export type Props = {
	columns: Array<Column>,
	columnsRatioWidth: Array<number>,
	components: Components,
	data: Array<Row>,
	onChangeColumnWidth: (columnsWidth: Array<number>) => void,
	onChangeSorting: (sorting: TableSorting) => void,
	onClickDataCell: OnClickDataCell,
	settings: Table,
	sorting: TableSorting
};

export type State = {
	columnsWidth: Array<number>,
	page: number,
	pageSize: number,
	width: number
};
