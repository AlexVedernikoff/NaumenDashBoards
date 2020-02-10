// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {Layout} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: (widget: Widget, ordinalNumber?: number) => ThunkAction,
	editLayout: (layout: Layout) => ThunkAction,
	removeWidget: (widteId: string) => ThunkAction,
	selectWidget: (widteId: string) => ThunkAction
};

export type ConnectedProps = {
	buildData: BuildDataMap,
	editable: boolean,
	editMode: boolean,
	newWidget: NewWidget | null,
	personalDashboard: boolean,
	selectedWidget: string,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions;
