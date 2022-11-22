// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type GroupCode = string | null;

export type PointData = {
	actions: Array<Action>,
	errorMessage?: string,
	group?: GroupCode,
	header: string,
	options?: Array<Option>,
	type: string,
	uuid?: string
};

export type Point = {
	data: PointData,
	geopositions: Array<Geoposition>,
	type: string
};
