// @flow
export type Module =
	| 'mapRest';

export type Method =
	| 'getCurrentContextObject'
	| 'getTrails';

export type Context = {
	contentCode: string,
	subjectUuid: string
};
