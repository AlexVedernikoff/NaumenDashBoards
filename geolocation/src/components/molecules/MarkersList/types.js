// @flow
import type {Geoposition} from 'types/geoposition';
import type {Point} from 'types/point';

type OwnProps = {
	dataMarkers: Object,
	dateMarkers: string | null,
	geoposition: Geoposition,
	header: string,
	marker: Point,
	markerActive: string,
	markerType: string,
	uuid: string
};

export type ConnectedFunctions = {
	header: string
};

export type ConnectedProps = {
	params: Object
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	exampleStateValue: string
};
