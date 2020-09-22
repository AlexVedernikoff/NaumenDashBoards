// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {LatLngBounds} from 'types/bound';
import type {Point} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	bounds: LatLngBounds,
	loading: boolean,
	showSinglePoint: boolean,
	singlePoint: Point
};

export type ConnectedFunctions = {
	resetSinglePoint: () => GeolocationAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	reloadBound: boolean
};
