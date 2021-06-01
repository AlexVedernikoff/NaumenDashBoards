// @flow
import type {Point} from 'types/point';
import type {Trail} from 'types/trail';

type OwnProps = {
	point: Point
};

export type ConnectedProps = {
	trails: Array<Trail>
};

export type Props = OwnProps & ConnectedProps;
