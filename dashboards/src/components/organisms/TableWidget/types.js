// @flow
import type {Column, FetchTableBuildDataAction, TableBuildData} from 'store/widgets/buildData/types';
import type {DrillDownAction, OpenCardObjectAction} from 'store/widgets/links/types';
import type {TableWidget} from 'store/widgets/data/types';

export type Props = {
	data: TableBuildData,
	loading: boolean,
	onDrillDown: DrillDownAction,
	onOpenCardObject: OpenCardObjectAction,
	onUpdateData: FetchTableBuildDataAction,
	onUpdateWidget: TableWidget => void,
	widget: TableWidget
};

export type State = {
	columns: Array<Column>,
	fixedColumnsCount: number,
};
