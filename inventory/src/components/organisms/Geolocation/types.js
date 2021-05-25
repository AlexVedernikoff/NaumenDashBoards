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
	resetSinglePoint: () => GeolocationAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
};
