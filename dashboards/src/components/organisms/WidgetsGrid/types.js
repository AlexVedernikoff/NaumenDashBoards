// @flow
import type {AddNewWidget, FocusWidget, ResetFocusedWidget, Widget} from 'store/widgets/data/types';
import type {Layout, Layouts, LayoutsPayloadForChange} from 'store/dashboard/layouts/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {UserData} from 'store/context/types';

export type Props = {
	addNewWidget: AddNewWidget,
	changeLayouts: (payload: LayoutsPayloadForChange) => Object,
	editableDashboard: boolean,
	editMode: boolean,
	focusedWidget: string,
	focusWidget: FocusWidget,
	layoutMode: LayoutMode,
	layouts: Layouts,
	resetFocusedWidget: ResetFocusedWidget,
	selectedWidget: string,
	showCreationInfo: boolean,
	user: UserData,
	widgets: Array<Widget>
};

export type ContextMenu = {
	x: number,
	y: number
};

export type State = {
	contextMenu: ?ContextMenu,
	lastWebLGLayouts: ?Layout[],
	width: ?number
};
