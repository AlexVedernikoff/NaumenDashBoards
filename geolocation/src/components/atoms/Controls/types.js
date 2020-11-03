// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {ThunkAction} from 'store/types';
import type {UpdatePointsMode} from 'types/helper';

export type OwnProps = {
};

export type ConnectedProps = {
	filterActive: boolean,
	filterOpen: boolean,
	filterShow: boolean,
	panelOpen: boolean,
	updatePointsMode: UpdatePointsMode
};

export type ConnectedFunctions = {
	fetchGeolocation: () => ThunkAction,
	reloadGeolocation: () => ThunkAction,
	toggleFilter: () => GeolocationAction,
	togglePanel: () => GeolocationAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	panelHover: boolean,
	reloadHover: boolean,
	filterHover: boolean
};
