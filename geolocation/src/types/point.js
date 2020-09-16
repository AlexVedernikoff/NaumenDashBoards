// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type Point = {
	actions?: Array<Action>,
	errorMessage?: string,
	geoposition: Geoposition,
	group: string,
	header: string,
	options?: Array<Option>,
	type: 'dynamic' | 'static',
	uuid?: string
};

export type DynamicPoint = Point

export type StaticPoint = {
	geoposition: Geoposition,
	data: Array<Point>
};

export type StaticGroup = {
	code: string,
	color: string,
	name: string
};

export type FetchResponse = {
	dynamicPoints: Array<DynamicPoint>,
	errors: Array<string>,
	staticGroups: Array<StaticGroup>,
	staticPoints: Array<StaticPoint>
}

