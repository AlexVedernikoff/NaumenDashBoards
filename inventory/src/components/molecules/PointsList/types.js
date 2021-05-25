// @flow
import type {Point} from 'types/point';

type OwnProps = {
	point: Point
};

export type ConnectedProps = {
	dynamicPoints: Array<Point>,
	staticPoints: Array<Point>
};

export type Props = ConnectedProps & OwnProps;

export type State = {
};
