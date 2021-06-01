// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {StaticGroup} from 'types/point';

export type OwnProps = {};

export type ConnectedProps = {
	open: boolean,
	staticGroups: Array<StaticGroup>
};

export type ConnectedFunctions = {
	resetAllGroups: () => GeolocationAction,
	selectAllGroups: () => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
