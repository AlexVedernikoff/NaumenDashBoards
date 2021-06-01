// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {LatLngBounds} from 'types/bound';

type OwnProps = {};

export type ConnectedProps = {
	bounds: LatLngBounds,
	panelRightPadding: number,
	timeUpdate: number
};

export type ConnectedFunctions = {
	resetSingleObject: () => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
