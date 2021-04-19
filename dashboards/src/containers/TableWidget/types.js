// @flow
import type {DrillDown, OpenCardObject} from 'src/store/widgets/links/types';
import type {FetchBuildData} from 'store/widgets/buildData/types';
import type {TableWidget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: DrillDown,
	fetchBuildData: FetchBuildData,
	openCardObject: OpenCardObject,
	updateWidget: TableWidget => Object
};

export type Props = ConnectedFunctions & {
	widget: TableWidget
};
