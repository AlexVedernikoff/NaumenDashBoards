// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {Geoposition} from 'types/geoposition';
import type {Point, PointData, PointType} from 'types/point';

export type OwnProps = {
	geoposition: Geoposition,
	pointData: PointData,
	showSingleObject: boolean,
	type: PointType
};

export type ConnectedProps = {
	showSingleObject: boolean,
	statusColor: string
};

export type ConnectedFunctions = {
	setSingleObject: (point: Point) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	actionShow: boolean
};
