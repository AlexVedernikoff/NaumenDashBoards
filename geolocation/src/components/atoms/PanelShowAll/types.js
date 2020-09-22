// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {PointType} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	type: PointType
};

export type ConnectedFunctions = {
	setTab: (panelShow: PointType) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
