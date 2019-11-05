// @flow
import type {LatLngBounds} from 'types/bound';

export type ConnectedProps = {
	bounds: LatLngBounds
};
export type ConnectedFunctions = {
};

export type Props =ConnectedFunctions & ConnectedProps;
