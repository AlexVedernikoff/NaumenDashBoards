// @flow
import type {Column, ColumnsWidth, Components, FixedPositions, Row} from 'Table/types';
import type {Ref} from 'components/types';
import type {TableHeaderSettings, TableSorting} from 'store/widgets/data/types';

export type Props = {
	columns: Array<Column>,
	columnSettings: TableHeaderSettings,
	columnsWidth: ColumnsWidth,
	components: Components,
	data: Array<Row>,
	fixedPositions: FixedPositions,
	forwardedRef: Ref<'div'>,
	onChangeColumnWidth: (width: number, column: Column) => void,
	onChangeSorting: TableSorting => void,
	scrollBarWidth: number,
	sorting: TableSorting,
	width: number
};
