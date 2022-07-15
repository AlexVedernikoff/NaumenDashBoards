// @flow
export type Entity = {
	desc: string,
	from: string | null,
	id: string,
	title: string,
	to: string | null,
	type: string
};

export type EntityState = {
	data: Entity,
	error: boolean,
	loading: boolean
};
