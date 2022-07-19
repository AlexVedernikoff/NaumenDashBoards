// @flow
import type {DrillDownAction, OpenCardObjectAction} from 'store/widgets/links/types';
import type {FetchTableBuildDataAction} from 'store/widgets/buildData/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {TableWidget} from 'store/widgets/data/types';

export type ConnectedProps = {
	updating: boolean
};

export type ConnectedFunctions = {
	drillDown: DrillDownAction,
	openCardObject: OpenCardObjectAction,
	updateData: FetchTableBuildDataAction,
	updateWidget: TableWidget => Object
};

export type Props = ConnectedProps & ConnectedFunctions & InjectOptionsProps & {
	widget: TableWidget
};
