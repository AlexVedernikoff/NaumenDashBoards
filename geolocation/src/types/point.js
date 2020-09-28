// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type PointType = 'dynamic' | 'static';

export type GroupCode = string | null;

export type PointData = {
	actions: Array<Action>,
	errorMessage?: string,
	group: GroupCode,
	header: string,
	options?: Array<Option>,
	type: 'dynamic' | 'static',
	uuid?: string
};

export type Point = {
	data: Array<PointData>,
	geoposition: Geoposition,
	type: PointType
};

export type StaticGroup = {
	checked: boolean,
	code: GroupCode,
	color: string,
	name: string
};

export type FetchResponse = {
	dynamicPoints: Array<Point>,
	errors: Array<string>,
	staticGroups: Array<StaticGroup>,
	staticPoints: Array<Point>
};
