// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export const NAME_POINT_TYPE = 'point';

export type EquipmentMainType = NAME_POINT_TYPE;
export type EquipmentType = 'passive' | 'active';
export type EquipType = 'clutch' | 'cross';

export type EquipmentData = {
	actions: Array<Action>,
	equipType?: EquipType,
	header: string,
	options?: Array<Option>,
	type: EquipmentMainType,
	uuid?: string
};

export type Equipment = {
	data: Array<EquipmentData>,
	geopositions: Array<Geoposition>,
	icon?: string,
	type: EquipmentType
};
