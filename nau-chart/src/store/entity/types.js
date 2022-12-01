// @flow
import type {VERIFY_EVENTS} from './constants';

export type ActionType = 'open_link' | 'change_responsible' | 'change_state';

export type Action = {
	inPlace?: boolean,
	link: string,
	name: string,
	states?: string[],
	type: ActionType
};

export type Presentation = 'full_length' | 'right_of_label' | 'under_label';

export type ValueType = {
	label: string,
	url: string
};

export type Option = {
	label?: string,
	presentation: Presentation,
	value: string | ValueType
};

export type Entity = {
	actions?: Action[],
	desc: string,
	editFormCode: string,
	from: string | null,
	header: string,
	icon: string,
	id: string,
	options?: Option[],
	title: string,
	to: string | null,
	type: string,
	uuid: string | null
};

export type EntityState = {
	activeElement: Entity,
	centerPointUuid: string,
	data: Entity[],
	error: boolean,
	exportTo: string,
	loading: boolean,
	position: {x: number, y: number},
	scale: number,
	searchObjects: [],
	searchText: string
};

export type EntityAction = {
	objects: Entity[],
	payload: null,
	text: string,
	type: $Keys<typeof VERIFY_EVENTS>,
	uuid: string
};
