// @flow
import type {Column, ColumnsWidth, Components, FixedPositions, OnClickCell, Row} from 'Table/types';
import type {RowAggregation} from 'store/widgets/buildData/types';
import type {Table, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: ColumnsWidth,
	components: Components,
	data: Array<Row>,
	fixedPositions: FixedPositions,
	onChangeScrollBarWidth: (scrollBarWidth: number) => void,
	onClickCell?: OnClickCell,
	onScroll: (event: SyntheticEvent<HTMLDivElement>) => void,
	page: number,
	pageSize: number,
	rowAggregations?: Array<RowAggregation>,
	settings: Table,
	sorting: TableSorting,
	width: number
};

export type State = {
	rows: Array<Row>
};
