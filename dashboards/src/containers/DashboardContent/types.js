// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {DrillDown, OpenCardObject} from 'store/widgets/links/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Layouts, LayoutsPayloadForChange} from 'store/dashboard/layouts/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedFunctions = {
	changeLayouts: (payload: LayoutsPayloadForChange) => Object,
	drillDown: DrillDown,
	editWidgetChunkData: (widget: Widget, chunkData: Object) => ThunkAction,
	fetchBuildData: (widget: Widget) => ThunkAction,
	openCardObject: OpenCardObject,
	removeWidget: (widgetId: string) => ThunkAction,
	selectWidget: (widgetId: string, callback: Function) => ThunkAction,
	updateWidget: Widget => Object
};

export type ConnectedProps = {
	buildData: BuildDataMap,
	editable: boolean,
	editMode: boolean,
	layoutMode: LayoutMode,
	layouts: Layouts,
	personalDashboard: boolean,
	selectedWidget: string,
	user: UserData,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions;
