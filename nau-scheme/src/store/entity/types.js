// @flow
export type Entity = {
	id: string,
	text: string
};

export type EntityState = {
	data: Entity,
	error: boolean,
	loading: boolean
};
