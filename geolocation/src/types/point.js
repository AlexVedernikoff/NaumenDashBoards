// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type PointType = 'dynamic' | 'static';

export type Point = {
	data: Array<PointData>,
	geoposition: Geoposition,
	type: PointType
};

export type Group = string | null;

export type PointData = {
	actions: Array<Action>,
	errorMessage?: string,
	group: Group,
	header: string,
	options?: Array<Option>,
	type: 'dynamic' | 'static',
	uuid?: string
};

export type StaticGroup = {
	code: string,
	color: string,
	name: string
};

export type FetchResponse = {
	dynamicPoints: Array<Point>,
	errors: Array<string>,
	staticGroups: Array<StaticGroup>,
	staticPoints: Array<Point>
}

