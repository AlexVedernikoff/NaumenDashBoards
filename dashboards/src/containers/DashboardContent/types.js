// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {Layout} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	drillDown: (widget: Widget, index: number) => ThunkAction,
	editLayout: (layout: Layout, layoutMode: string) => ThunkAction,
	editWidgetChunkData: (widget: Widget, chunkData: Object) => ThunkAction,
	fetchBuildData: (widget: Widget) => ThunkAction,
	removeWidget: (widgetId: string) => ThunkAction,
	selectWidget: (widgetId: string) => ThunkAction,
	updateWidget: Widget => Object
};

export type ConnectedProps = {
	buildData: BuildDataMap,
	editMode: boolean,
	editable: boolean,
	layoutMode: string,
	newWidget: NewWidget | null,
	personalDashboard: boolean,
	selectedWidget: string,
	user: UserData,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions;
