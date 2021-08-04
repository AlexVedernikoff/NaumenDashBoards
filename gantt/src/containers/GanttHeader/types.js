// @flow
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	user: UserData
};

export type ConnectedFunctions = {
	getSettings: (refresh: boolean) => ThunkAction,
};

export type Props = ConnectedProps & ConnectedFunctions;
