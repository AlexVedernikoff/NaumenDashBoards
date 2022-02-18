// @flow
import type {Action} from 'types/action';
import type {ThunkAction} from 'store/types';

type OwnProps = {
	actions: Array<Action>,
	header: string,
	showKebab: boolean,
	uuid: string
};

export type ConnectedProps = {};

export type ConnectedFunctions = {
	fetchGeolocation: () => ThunkAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	openAction: boolean
};
