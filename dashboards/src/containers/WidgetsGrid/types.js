// @flow
import type {AddNewWidget, FocusWidget, ResetFocusedWidget, Widget} from 'store/widgets/data/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {Layouts, LayoutsPayloadForChange} from 'store/dashboard/layouts/types';
import type {Props as ComponentProps} from 'components/organisms/WidgetsGrid/types';
import type {UserData} from 'store/context/types';

export type ConnectedFunctions = {
	addNewWidget: AddNewWidget,
	changeLayouts: (payload: LayoutsPayloadForChange) => Object,
	focusWidget: FocusWidget,
	resetFocusedWidget: ResetFocusedWidget
};

export type ConnectedProps = {
	editableDashboard: boolean,
	editMode: boolean,
	focusedWidget: string,
	layoutMode: LayoutMode,
	layouts: Layouts,
	selectedWidget: string,
	showCreationInfo: boolean,
	user: UserData,
	widgets: Array<Widget>
};

export type Props = ConnectedProps & ConnectedFunctions & ComponentProps;
