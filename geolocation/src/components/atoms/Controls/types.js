// @flow
import type {ThunkAction} from 'store/types';
import type {UpdatePointsMode} from 'types/helper';

export type OwnProps = {
	setBounds: () => void
};

export type ConnectedProps = {
	updatePointsMode: UpdatePointsMode
};

export type ConnectedFunctions = {
	fetchGeolocation: () => ThunkAction,
	reloadGeolocation: () => ThunkAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	hover: boolean
};
