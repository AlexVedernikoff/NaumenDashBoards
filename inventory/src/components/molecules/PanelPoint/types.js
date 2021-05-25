// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {Geoposition} from 'types/geoposition';
import type {Point, PointData, PointType} from 'types/point';

export type OwnProps = {
	geoposition: Geoposition,
	pointData: PointData,
	showSinglePoint: boolean,
	type: PointType
};

export type ConnectedProps = {
	showSinglePoint: boolean,
	statusColor: string
};

export type ConnectedFunctions = {
	setSinglePoint: (point: Point) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	actionShow: boolean
};
