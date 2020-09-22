// @flow
import type {Point} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	points: Array<Point>
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
