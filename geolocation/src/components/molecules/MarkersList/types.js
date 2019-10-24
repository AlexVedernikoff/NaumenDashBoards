// @flow
import type {MultiplePoint} from 'types/multiple';
import type {Point} from 'types/point';

type OwnProps = {
	marker: Point | MultiplePoint,
	uuid: string
};


export type ConnectedProps = {
	dynamicMarkers: Array<Point>,
	multipleMarkers: Array<MultiplePoint>,
	staticMarkers: Array<Point>
};

export type Props = ConnectedProps & OwnProps;

export type State = {
};
