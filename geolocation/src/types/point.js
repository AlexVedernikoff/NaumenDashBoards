// @flow
import type {Geoposition} from './geoposition';

export type Point = {
	actions?: Array<Object>,
	errorMessage?: string,
	geoposition: Geoposition,
	header: string,
	options?: Array<Object>,
	type: string,
	uuid?: string
};
