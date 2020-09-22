// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {Geoposition} from 'types/geoposition';
import type {IconName} from 'types/helper';
import type {Point} from 'types/point';

export type OwnProps = {
	point: Point
};

export type ConnectedFunctions = {
	setSinglePoint: (point: Point) => GeolocationAction
};

export type ConnectedProps = {
	active: boolean,
	color: string, // '#4D92C8'
	geoposition: Geoposition
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	open: boolean,
	type: IconName
};
