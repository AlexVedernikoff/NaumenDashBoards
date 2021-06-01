// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type EquipmentType = 'passive' | 'active';
export type EquipType = 'clutch' | 'cross';

export type EquipmentData = {
	actions: Array<Action>,
	equipType?: EquipType,
	header: string,
	options?: Array<Option>,
	type: EquipmentType,
	uuid?: string
};

export type Equipment = {
	data: Array<EquipmentData>,
	geoposition: Geoposition,
	icon?: string,
	type: EquipmentType
};
