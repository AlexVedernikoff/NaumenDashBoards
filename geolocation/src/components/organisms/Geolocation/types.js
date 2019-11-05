// @flow
import type {ThunkAction} from 'store/types';
import type {LatLngBounds} from 'types/bound';

type OwnProps = {};

export type ConnectedProps = {
	bounds: LatLngBounds,
	reloadInterval: number
};

export type ConnectedFunctions = {
	reloadGeolocation: () => ThunkAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;
