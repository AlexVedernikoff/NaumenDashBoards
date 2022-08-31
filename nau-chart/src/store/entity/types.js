// @flow
export type ActionType = 'open_link' | 'change_responsible' | 'change_state';

export type Action = {
	inPlace?: boolean,
	link: string,
	name: string,
	states?: Array<string>,
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
	actions?: Array<Action>,
	desc: string,
	from: string | null,
	id: string,
	options?: Array<Option>,
	title: string,
	to: string | null,
	type: string,
};

export type EntityState = {
	activeElement: Entity,
	data: Entity[],
	error: boolean,
	exportTo: string,
	loading: boolean,
	scale: number
};
