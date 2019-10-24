// @flow
import type {Geoposition} from './geoposition';
import type {Point} from './point';

export type MultiplePoint = {
	data: Array<Point>,
	geoposition: Geoposition,
	header: string,
	type: 'multiple'
};
