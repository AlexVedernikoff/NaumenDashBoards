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
