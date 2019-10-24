// @flow
import type {ThunkAction} from 'store/types';

type OwnProps = {
};

export type ConnectedProps = {
};

export type ConnectedFunctions = {
	reloadGeolocation: () => ThunkAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	hover: boolean
};
