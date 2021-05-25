// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {PointType} from 'types/point';

type OwnProps = {
	header: string
};

export type ConnectedProps = {
	dynamicPointsListName: string,
	panelShow: PointType,
	staticPointsListName: string
};

export type ConnectedFunctions = {
	setTab: (panelShow: PointType) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
