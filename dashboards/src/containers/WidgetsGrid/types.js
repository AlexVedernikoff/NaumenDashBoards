// @flow
import type {AddNewWidgetAction, DispatchAddNewWidget, FocusWidget, ResetFocusedWidget, Widget} from 'store/widgets/data/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Layouts, LayoutsPayloadForChange} from 'store/dashboard/layouts/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedFunctions = {
	addNewWidget: AddNewWidgetAction,
	changeLayouts: (payload: LayoutsPayloadForChange) => ThunkAction,
	focusWidget: FocusWidget,
	resetFocusedWidget: ResetFocusedWidget,
	resetWidget: () => void,
	setLayoutsChanged: () => void
};

export type DispatchConnectedFunctions = {
	addNewWidget: DispatchAddNewWidget,
	changeLayouts: (payload: LayoutsPayloadForChange) => void,
	focusWidget: (widgetId: string) => void,
	resetFocusedWidget: () => void,
	resetWidget: () => void,
	setLayoutsChanged: () => void
};

export type ConnectedProps = {
	editableDashboard: boolean,
	editMode: boolean,
	focusedWidget: string,
	hasCreateNewWidget: boolean,
	isMobileDevice: boolean,
	isUserMode: boolean,
	layoutMode: LayoutMode,
	layouts: Layouts,
	selectedWidget: string,
	showCreationInfo: boolean,
	user: UserData,
	widgets: Array<Widget>
};
