// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {LatLngBounds} from 'types/bound';

export type ConnectedProps = {
	bounds: LatLngBounds
};
export type ConnectedFunctions = {
	resetSinglePoint: () => GeolocationAction
};

export type Props =ConnectedFunctions & ConnectedProps;
