// @flow
import type {EditPanelPosition} from 'store/dashboard/settings/types';

export type ConnectedProps = {
	position: EditPanelPosition,
	selectedWidgetId: string,
	swiped: boolean,
	title: string,
	width: number
};

export type ConnectedFunctions = {
	updatePanelPosition: (position: EditPanelPosition) => void,
	updateSwiped: (swiped: boolean) => void,
	updateWidth: (width: number) => void
};

export type Props = ConnectedProps & ConnectedFunctions;
