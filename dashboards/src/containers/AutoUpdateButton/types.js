// @flow
import type {AutoUpdateSettings} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	settings: AutoUpdateSettings,
};

export type ConnectedFunctions = {
	onChangeRemainder: (remainder: number) => ThunkAction,
	onSaveSettings: (enabled: boolean, interval: string | number) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
