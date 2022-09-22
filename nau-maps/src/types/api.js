// @flow
export type Module =
	| 'mapRest';

export type Method =
	| 'getCurrentContextObject'
	| 'getMapObjects';

export type Context = {
	contentCode: string,
	subjectUuid: string
};

export type UserData = {
	admin: boolean,
	licensed: boolean,
	login: string,
	roles: Array<string>,
	title: string,
	uuid: string
};
