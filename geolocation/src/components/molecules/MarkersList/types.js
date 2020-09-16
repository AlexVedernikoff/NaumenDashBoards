// @flow
import type {DynamicPoint, StaticPoint} from 'types/point';
import type {Point} from 'types/point';

type OwnProps = {
	marker: DynamicPoint | StaticPoint
};

export type ConnectedProps = {
	dynamicPoints: Array<DynamicPoint>,
	staticPoints: Array<StaticPoint>
};

export type Props = ConnectedProps & OwnProps;

export type State = {
};
