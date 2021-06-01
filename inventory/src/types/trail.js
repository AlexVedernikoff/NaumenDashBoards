// @flow
import type {Action} from './action';
import {Equipment} from './equipment';
import type {Option} from './option';
import type {Part} from './part';

export type TrailType = 'wols';

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
	parts: Array<Part>,
	type: TrailType
};
