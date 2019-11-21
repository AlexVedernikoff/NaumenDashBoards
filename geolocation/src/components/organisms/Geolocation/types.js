// @flow
import type {LatLngBounds} from 'types/bound';

type OwnProps = {};

export type ConnectedProps = {
	bounds: LatLngBounds,
	loading: boolean
};

export type ConnectedFunctions = {
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	reloadBound: boolean
};
