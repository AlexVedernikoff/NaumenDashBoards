// @flow
import type {AutoUpdateSettings} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';
import type {UserRole} from 'store/context/types';

export type ConnectedProps = {
	personalDashboard: boolean,
	role: UserRole,
	settings: AutoUpdateSettings,
};

export type ConnectedFunctions = {
	onChangeRemainder: (remainder: number) => ThunkAction,
	onSaveSettings: (enabled: boolean, interval: string | number) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
