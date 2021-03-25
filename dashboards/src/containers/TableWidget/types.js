// @flow
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
import type {FetchTableBuildData} from 'store/widgets/buildData/types';
import type {TableWidget} from 'store/widgets/data/types';

export type ConnectedProps = {
	updating: boolean
};

export type ConnectedFunctions = {
	drillDown: DrillDown,
	openCardObject: OpenCardObject,
	updateData: FetchTableBuildData,
	updateWidget: TableWidget => Object
};

export type Props = ConnectedProps & ConnectedFunctions & {
	widget: TableWidget
};
