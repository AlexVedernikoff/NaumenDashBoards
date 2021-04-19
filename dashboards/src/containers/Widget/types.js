// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	clearWarningMessage: (widgetId: string) => ThunkAction
};
