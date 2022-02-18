// @flow
import type {Action} from './action';
import {Equipment} from './equipment';
import type {Geoposition} from './geoposition';
import type {Option} from './option';
import type {Part} from './part';

export const NAME_TRAIL_TYPE = 'wols';

export type TrailType = NAME_TRAIL_TYPE;

export type TrailData = {
	actions: Array<Action>,
	color?: string,
	header: string,
	options?: Array<Option>,
	type: TrailType,
	uuid?: string
};

export type Trail = {
	data: Array<TrailData>,
	equipments: Array<Equipment>,
	geopositions: Array<Geoposition>,
	parts: Array<Part>,
	type: TrailType
};
