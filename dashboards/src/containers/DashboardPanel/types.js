// @flow
import type {EditPanelPosition} from 'store/dashboard/settings/types';

export type ConnectedProps = {
	position: EditPanelPosition,
	selectedWidgetId: string,
	showBackButton: boolean,
	showCopyPanel: boolean,
	swiped: boolean,
	title: string,
	width: number
};

export type ConnectedFunctions = {
	goBack: () => void,
	updatePanelPosition: (position: EditPanelPosition) => void,
	updateSwiped: (swiped: boolean) => void,
	updateWidth: (width: number) => void
};

export type Props = ConnectedProps & ConnectedFunctions;
