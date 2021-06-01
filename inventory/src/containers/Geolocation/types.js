// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {LatLngBounds} from 'types/bound';

export type ConnectedProps = {
	bounds: LatLngBounds
};
export type ConnectedFunctions = {
	resetSingleObject: () => GeolocationAction
};

export type Props = ConnectedProps & ConnectedFunctions;
