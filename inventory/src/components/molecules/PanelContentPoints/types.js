// @flow
import type {Point} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	points: Array<Point>,
	timeUpdate: number
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
