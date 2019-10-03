// @flow
import type {Point} from 'types/point';

type OwnProps = {
	marker: Point
};

export type ConnectedProps = {
	marker: Point
};

export type ConnectedFunctions = {
	marker: Point
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {};
