// @flow
import type {BuildDataMap} from 'store/widgets/buildData/types';
import type {DrillDown, OpenCardObject, OpenNavigationLink} from 'store/widgets/links/types';
import type {FocusWidget, ResetFocusedWidget, Widget} from 'store/widgets/data/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Layouts, LayoutsPayloadForChange} from 'store/dashboard/layouts/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedFunctions = {
	changeLayouts: (payload: LayoutsPayloadForChange) => Object,
	drillDown: DrillDown,
	editWidgetChunkData: (widget: Widget, chunkData: Object) => ThunkAction,
	fetchBuildData: (widget: Widget) => ThunkAction,
	focusWidget: FocusWidget,
	openCardObject: OpenCardObject,
	openNavigationLink: OpenNavigationLink,
	removeWidget: (widgetId: string) => ThunkAction,
	resetFocusedWidget: ResetFocusedWidget,
	selectWidget: (widgetId: string, callback: Function) => ThunkAction,
	updateWidget: Widget => Object
};

export type ConnectedProps = {
	buildData: BuildDataMap,
	editable: boolean,
	editMode: boolean,
	focusedWidget: string,
	layoutMode: LayoutMode,
	layouts: Layouts,
	personalDashboard: boolean,
	selectedWidget: string,
	user: UserData,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions;
