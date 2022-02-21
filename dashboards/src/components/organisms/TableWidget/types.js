// @flow
import type {Column, FetchTableBuildData, TableBuildData} from 'store/widgets/buildData/types';
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
import type {TableWidget} from 'store/widgets/data/types';

export type Props = {
	data: TableBuildData,
	loading: boolean,
	onDrillDown: DrillDown,
	onOpenCardObject: OpenCardObject,
	onUpdateData: FetchTableBuildData,
	onUpdateWidget: TableWidget => void,
	widget: TableWidget
};

export type State = {
	columns: Array<Column>,
	fixedColumnsCount: number,
};
