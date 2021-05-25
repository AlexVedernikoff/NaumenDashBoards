// @flow
import type {GeolocationAction} from 'store/geolocation/types';
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
	color: string // '#EB5757'
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	open: boolean,
	timeoutId: TimeoutID | null,
	type: IconName
};
