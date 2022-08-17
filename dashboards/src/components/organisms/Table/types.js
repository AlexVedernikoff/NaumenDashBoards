// @flow
import type {DefaultProps as DefaultCellProps, Props as CellProps} from './components/Cell/types';
import type {Props as HeaderProps} from './components/HeaderCell/types';
import type {Props as RowProps} from './components/Row/types';
import type {SingleRowInfo} from 'store/widgets/buildData/types';
import type {Table, TableSorting, WidgetTooltip} from 'store/widgets/data/types';

export type Column = {
	accessor: string,
	columns?: Array<Column>,
	footer: string,
	header: string,
	tooltip: WidgetTooltip,
	width?: number,
	[string]: any
};

export type Row = {
	[accessor: string]: string
};

export type CellConfigProps = React$Config<CellProps, DefaultCellProps>;

export type ValueProps = {
	column: Column,
	fontColor: string,
	value: string | number
};

export type Components = $Shape<{
	BodyCell: React$ComponentType<CellConfigProps>,
	Cell: React$ComponentType<CellConfigProps>,
	FooterCell: React$ComponentType<CellConfigProps>,
	HeaderCell: React$ComponentType<HeaderProps>,
	Row: React$ComponentType<RowProps>,
	TotalCell: React$ComponentType<CellConfigProps>,
	Value: React$ComponentType<ValueProps>,
}>;

export type OnClickCellProps = {
	column: Column,
	row: Row | null,
	rowIndex: number,
	value: number | string
};

export type OnClickCell = (event: MouseEvent, props: OnClickCellProps) => void;

export type ColumnsWidth = {
	[accessor: string]: number
};

export type FixedPositions = {
	[accessor: string]: number
};

export type Props = {
	className: string,
	columns: Array<Column>,
	columnsRatioWidth: ColumnsWidth,
	components?: Components,
	countTotals: number,
	data: Array<Row>,
	fixedColumnsCount: number,
	getNewColumnsWidth: (column: Column, newWidth: number, columnsWidth: ColumnsWidth, minWidth?: ?number) => ColumnsWidth,
	loading: boolean,
	onChangeColumnWidth?: (columnsWidth: ColumnsWidth) => void,
	onChangeSorting?: (sorting: TableSorting) => void,
	onClickDataCell?: OnClickCell,
	onFetch: (pageSize: number, page: number, sorting: TableSorting) => void,
	pageSize: number,
	rowsInfo?: Array<SingleRowInfo>,
	settings: Table,
	sorting: TableSorting,
	total: number
};

export type State = {
	columnsWidth: ColumnsWidth,
	components: Components,
	containerWidth: number,
	dataColumns: Array<Column>,
	fixedPositions: FixedPositions,
	page: number,
	scrollBarWidth: number,
	showPadding: boolean,
	sorting: TableSorting,
	width: number
};
