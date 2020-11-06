// @flow
import type {DefaultProps as DefaultCellProps, Props as CellProps} from './components/Cell/types';
import type {Props as HeaderProps} from './components/HeaderCell/types';
import type {Props as RowProps} from './components/Row/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Column = {
	accessor: string,
	columns?: Array<Column>,
	footer: string,
	header: string,
	[string]: any
};

export type Row = {
	[accessor: string]: string | number
};

export type CellConfigProps = React$Config<CellProps, DefaultCellProps>;

export type Components = $Shape<{
	BodyCell: React$ComponentType<CellConfigProps>,
	Cell: React$ComponentType<CellConfigProps>,
	FooterCell: React$ComponentType<CellConfigProps>,
	HeaderCell: React$ComponentType<HeaderProps>,
	Row: React$ComponentType<RowProps>
}>;

export type OnClickCellProps = {
	column: Column,
	row: Row | null,
	value: number | string
};

export type OnClickCell = (event: MouseEvent, props: OnClickCellProps) => void;

export type ColumnsWidth = {
	[accessor: string]: number
};

export type Props = {
	className: string,
	columns: Array<Column>,
	columnsRatioWidth: ColumnsWidth,
	components?: Components,
	data: Array<Row>,
	onChangeColumnWidth?: (columnsWidth: ColumnsWidth) => void,
	onChangeSorting?: (sorting: TableSorting) => void,
	onClickDataCell?: OnClickCell,
	settings: Table,
	sorting: TableSorting
};

export type State = {
	columnsWidth: ColumnsWidth,
	components: Components,
	page: number,
	pageSize: number,
	sorting: TableSorting,
	width: number | null
};
