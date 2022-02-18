// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export const NAME_SECTION_TYPE = 'section';

export type PartType = NAME_SECTION_TYPE;

export type PartData = {
	actions: Array<Action>,
	color?: string,
	header: string,
	options?: Array<Option>,
	type: PartType,
	uuid?: string
};

export type Part = {
	data: Array<PartData>,
	geopositions: Array<Geoposition>,
	type: PartType
};
