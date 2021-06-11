// @flow
import type {Action} from './action';
import {Equipment, EquipmentType, EquipType} from './equipment';
import type {Geoposition} from './geoposition';
import type {Option} from './option';
import type {Part, PartType} from './part';
import type {TrailType} from './trail';

export type CommonType = TrailType | EquipmentType | PartType;

export type CommonData = {
	actions: Array<Action>,
	color?: string,
	equipType?: EquipType,
	header: string,
	options?: Array<Option>,
	type: CommonType,
	uuid?: string
};

export type Common = {
	data: Array<TrailData>,
	equipments?: Array<Equipment>,
	geopositions: Array<Geoposition>,
	icon?: string,
	parts?: Array<Part>,
	type: TrailType
};
