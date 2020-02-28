// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {Layout} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: (widget: Widget, ordinalNumber?: number) => ThunkAction,
	editLayout: (layout: Layout) => ThunkAction,
	removeWidget: (widgetId: string) => ThunkAction,
	selectWidget: (widgetId: string) => ThunkAction,
	updateWidget: Widget => Object
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
