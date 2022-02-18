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
	toggleFilter: () => GeolocationAction,
	togglePanel: () => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	filterHover: boolean,
	panelHover: boolean,
	reloadHover: boolean
};
