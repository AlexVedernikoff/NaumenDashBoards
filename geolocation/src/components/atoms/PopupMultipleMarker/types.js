// @flow
import type {StaticPoint} from 'types/point';
import type {Point} from 'types/point';

type OwnProps = {
	marker: StaticPoint
};

export type ConnectedProps = {
};

export type ConnectedFunctions = {
	openToggle: () => void
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	actionsShadow: boolean,
	count: number,
	dataMarkers: Array<Point>,
	headerShadow: boolean,
	markerNumber: number,
	nextActive: boolean,
	prevActive: boolean,
	tmpMarker: Point
};
