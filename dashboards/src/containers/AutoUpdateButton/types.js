// @flow
import type {AutoUpdateSettings} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	canChangeConfiguration: boolean,
	settings: AutoUpdateSettings,
};

export type ConnectedFunctions = {
	getSettings: (refresh: boolean) => ThunkAction,
	onSaveSettings: (enabled: boolean, interval: string | number) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
