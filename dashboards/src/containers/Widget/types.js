// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	clearWarningMessage: (widgetId: string) => ThunkAction,
	setSelectedWidget: (widgetId: string) => ThunkAction
};

export type ConnectedProps = {
	editMode: boolean,
	isMobileDevice: boolean,
};
